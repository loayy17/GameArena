using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class FriendService(AppDbContext _context, IEventBus _eventBus) : IFriendService
    {
        public async Task SendRequestAsync(Guid senderId, Guid receiverId)
        {
            if (senderId == receiverId)
                throw new AppException(ErrorCode.InvalidRequest);

            if (await IsBlockedAsync(senderId, receiverId))
                throw new AppException(ErrorCode.UserBlockedYou);

            if (await _context.UserFriends.AnyAsync(x =>
                (x.UserId == senderId && x.FriendId == receiverId) ||
                (x.UserId == receiverId && x.FriendId == senderId)))
                throw new AppException(ErrorCode.AlreadyFriends);

            var existingRequest = await _context.FriendRequests
                .Where(fr => (fr.SenderId == senderId && fr.ReceiverId == receiverId) ||
                             (fr.SenderId == receiverId && fr.ReceiverId == senderId))
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
            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == senderId &&
                    fr.ReceiverId == userId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            request.Status = FriendRequestStatus.Accepted;

            if (!await _context.UserFriends.AnyAsync(x => x.UserId == userId && x.FriendId == senderId))
                _context.UserFriends.Add(new UserFriends { UserId = userId, FriendId = senderId });
            if (!await _context.UserFriends.AnyAsync(x => x.UserId == senderId && x.FriendId == userId))
                _context.UserFriends.Add(new UserFriends { UserId = senderId, FriendId = userId });

            await _context.SaveChangesAsync();

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

        public async Task RemoveFriendAsync(Guid userId, Guid friendId)
        {
            var friendships = await _context.UserFriends
                .Where(uf =>
                    (uf.UserId == userId && uf.FriendId == friendId) ||
                    (uf.UserId == friendId && uf.FriendId == userId))
                .ToListAsync();

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

            var friendships = await _context.UserFriends
                .Where(uf =>
                    (uf.UserId == blockerId && uf.FriendId == blockedId) ||
                    (uf.UserId == blockedId && uf.FriendId == blockerId))
                .ToListAsync();

            _context.UserFriends.RemoveRange(friendships);
            await _context.SaveChangesAsync();
        }

        public async Task UnblockUserAsync(Guid blockerId, Guid blockedId)
        {
            var block = await _context.Blocks
                .FirstOrDefaultAsync(b => b.BlockerId == blockerId && b.BlockedId == blockedId)
                ?? throw new AppException(ErrorCode.NotBlocked);

            _context.Blocks.Remove(block);
            await _context.SaveChangesAsync();
        }

        public async Task<List<UserResponse>> GetFriendsAsync(Guid userId, UserFilterRequest? filter)
        {
            var query = _context.UserFriends
                .Where(x => x.UserId == userId)
                .Include(x => x.Friend)
                .Select(x => x.Friend)
                .AsQueryable();

            if (filter != null && !string.IsNullOrWhiteSpace(filter.Name))
            {
                var searchTerm = filter.Name.ToLower();
                query = query.Where(u =>
                    (u.UserName != null && u.UserName.ToLower().Contains(searchTerm)) ||
                    (u.Email != null && u.Email.ToLower().Contains(searchTerm)));
            }

            return (await query.ToListAsync()).Select(MapperHelper.ToDto).ToList();
        }

        public async Task<List<FriendRequestReceivedResponse>> GetReceivedRequestsAsync(Guid userId)
        {
            var requests = await _context.FriendRequests
                .Where(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending)
                .Include(u => u.Sender)
                .ToListAsync();

            return requests.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId)
        {
            var requests = await _context.FriendRequests
                .Where(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending)
                .Include(fr => fr.Receiver)
                .ToListAsync();

            return requests.Select(MapperHelper.ToSentRequestDto).ToList();
        }

        private async Task<bool> IsBlockedAsync(Guid userId, Guid blockedById)
        {
            return await _context.Blocks.AnyAsync(b =>
                (b.BlockerId == blockedById && b.BlockedId == userId) ||
                (b.BlockerId == userId && b.BlockedId == blockedById));
        }
    }
}
