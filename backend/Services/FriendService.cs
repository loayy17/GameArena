using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace backend.Services
{
    public class FriendService(AppDbContext _context, IEventBus _eventBus, ILogger<FriendService> _logger) : IFriendService
    {
        public async Task SendRequestAsync(Guid senderId, Guid receiverId)
        {
            if (senderId == receiverId)
                throw new AppException(ErrorCode.InvalidRequest);

            var blocker = await SocialQueryHelper.GetBlockerAsync(_context, senderId, receiverId);
            if (blocker != null)
                throw new AppException(blocker == receiverId ? ErrorCode.UserBlockedYou : ErrorCode.YouBlockedUser);

            if (await SocialQueryHelper.AreFriendsAsync(_context, senderId, receiverId))
                throw new AppException(ErrorCode.AlreadyFriends);

            var existingRequest = await _context.FriendRequests
                .Where(fr => fr.Status == FriendRequestStatus.Pending &&
                             ((fr.SenderId == senderId && fr.ReceiverId == receiverId) ||
                              (fr.SenderId == receiverId && fr.ReceiverId == senderId)))
                .Select(fr => fr.SenderId == senderId ? 1 : 2)
                .FirstOrDefaultAsync();

            if (existingRequest == 1)
                throw new AppException(ErrorCode.RequestAlreadyExists);
            if (existingRequest == 2)
                throw new AppException(ErrorCode.ReceiverHasAlreadySentRequest);

            _context.FriendRequests.Add(new FriendRequest
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Status = FriendRequestStatus.Pending
            });

            await _context.SaveChangesAsync();

            var sender = await _context.Users
                .Where(u => u.Id == senderId)
                .Select(u => new { u.UserName })
                .FirstAsync();

            await _eventBus.PublishAsync(new FriendRequestSentEvent(senderId, receiverId, sender.UserName!));
        }

        public async Task AcceptRequestAsync(Guid userId, Guid senderId)
        {
            var blocker = await SocialQueryHelper.GetBlockerAsync(_context, userId, senderId);
            if (blocker != null)
                throw new AppException(blocker == senderId ? ErrorCode.YouBlockedUser : ErrorCode.UserBlockedYou);

            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == senderId &&
                    fr.ReceiverId == userId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                request.Status = FriendRequestStatus.Accepted;

                var existingFriendships = await _context.UserFriends
                    .Where(x => (x.UserId == userId && x.FriendId == senderId) ||
                                (x.UserId == senderId && x.FriendId == userId))
                    .Select(x => x.UserId)
                    .ToListAsync();

                if (!existingFriendships.Contains(userId))
                    _context.UserFriends.Add(new UserFriends { UserId = userId, FriendId = senderId });
                if (!existingFriendships.Contains(senderId))
                    _context.UserFriends.Add(new UserFriends { UserId = senderId, FriendId = userId });

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (DbUpdateException)
            {
                await transaction.RollbackAsync();

                _context.ChangeTracker.Clear();
                var currentRequest = await _context.FriendRequests
                    .AsNoTracking()
                    .FirstOrDefaultAsync(fr =>
                        fr.SenderId == senderId &&
                        fr.ReceiverId == userId);

                if (currentRequest?.Status == FriendRequestStatus.Accepted)
                    throw new AppException(ErrorCode.AlreadyFriends);

                _logger.LogWarning("Race condition on friendship insert between {UserId} and {SenderId}, rolling back", userId, senderId);
                throw new AppException(ErrorCode.RequestAlreadyProcessed);
            }

            var accepter = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.UserName })
                .FirstAsync();

            await _eventBus.PublishAsync(new FriendRequestAcceptedEvent(senderId, userId, accepter.UserName!));
        }

        public async Task DeclineRequestAsync(Guid userId, Guid senderId)
        {
            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == senderId &&
                    fr.ReceiverId == userId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            request.Status = FriendRequestStatus.Rejected;
            await _context.SaveChangesAsync();

            await _eventBus.PublishAsync(new FriendRequestDeclinedEvent(senderId, userId));
        }

        public async Task CancelRequestAsync(Guid userId, Guid receiverId)
        {
            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == userId &&
                    fr.ReceiverId == receiverId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            request.Status = FriendRequestStatus.Cancelled;
            await _context.SaveChangesAsync();
            await _eventBus.PublishAsync(new FriendRequestCancelledEvent(userId, receiverId));
        }

        public async Task RemoveFriendAsync(Guid userId, Guid friendId)
        {
            var friendships = await SocialQueryHelper.GetFriendshipsAsync(_context, userId, friendId);

            if (friendships.Count == 0)
                throw new AppException(ErrorCode.IsNotFriend);

            _context.UserFriends.RemoveRange(friendships);
            await _context.SaveChangesAsync();
            await _eventBus.PublishAsync(new FriendRemovedEvent(userId, friendId));
        }

        public async Task BlockUserAsync(Guid blockerId, Guid blockedId)
        {
            if (blockerId == blockedId)
                throw new AppException(ErrorCode.CannotSelfBlock);

            if (await _context.Blocks.AnyAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId))
                throw new AppException(ErrorCode.AlreadyBlocked);

            _context.Blocks.Add(new Block { BlockerId = blockerId, BlockedId = blockedId });

            var friendships = await SocialQueryHelper.GetFriendshipsAsync(_context, blockerId, blockedId);

            _context.UserFriends.RemoveRange(friendships);

            var pendingRequests = await _context.FriendRequests
                .Where(fr =>
                    fr.Status == FriendRequestStatus.Pending &&
                    ((fr.SenderId == blockerId && fr.ReceiverId == blockedId) ||
                     (fr.SenderId == blockedId && fr.ReceiverId == blockerId)))
                .ToListAsync();

            foreach (var req in pendingRequests)
            {
                req.Status = FriendRequestStatus.Cancelled;
            }

            await _context.SaveChangesAsync();

            var cancelledEvents = pendingRequests
                .Select(req => new FriendRequestCancelledEvent(req.SenderId, req.ReceiverId))
                .ToList();

            foreach (var evt in cancelledEvents)
            {
                await _eventBus.PublishAsync(evt);
            }

            await _eventBus.PublishAsync(new UserBlockedEvent(blockerId, blockedId));
        }

        public async Task UnblockUserAsync(Guid blockerId, Guid blockedId)
        {
            var block = await _context.Blocks
                .FirstOrDefaultAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId)
                ?? throw new AppException(ErrorCode.NotBlocked);

            _context.Blocks.Remove(block);
            await _context.SaveChangesAsync();
            await _eventBus.PublishAsync(new UserUnblockedEvent(blockerId, blockedId));
        }
    }
}
