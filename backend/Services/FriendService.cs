using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class FriendService(AppDbContext _context) : IFriendService
    {
        public async Task SendFriendRequestAsync(Guid senderId, Guid receiverId)
        {
            if (senderId == receiverId) throw new AppException(ErrorCode.InvalidRequest);

            var exists = await _context.Users.AnyAsync(x => x.Id == senderId || x.Id == receiverId);

            if (!exists) throw new AppException(ErrorCode.UserNotFound);

            var alreadyFriends = await _context.UserFriends.AnyAsync(x =>
                (x.UserId == senderId && x.FriendId == receiverId) ||
                (x.UserId == receiverId && x.FriendId == senderId));

            if (alreadyFriends) throw new AppException(ErrorCode.AlreadyFriends);

            var requestExists = await _context.FriendRequests.AnyAsync(fr => fr.SenderId == senderId && fr.ReceiverId == receiverId);

            if (requestExists) throw new AppException(ErrorCode.RequestAlreadyExists);

            var reverseRequest = await _context.FriendRequests.AnyAsync(fr => fr.SenderId == receiverId && fr.ReceiverId == senderId);

            if (reverseRequest) throw new AppException(ErrorCode.ReceiverHasAlreadySentRequest);

            _context.FriendRequests.Add(new FriendRequest
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                CreatedAt = DateTime.UtcNow,
                Status = FriendRequestStatus.Pending
            });

            await _context.SaveChangesAsync();
        }

        public async Task AcceptFriendRequestAsync(Guid userId, Guid senderId)
        {
            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == senderId &&
                    fr.ReceiverId == userId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            request.Status = FriendRequestStatus.Accepted;
            if (!await _context.UserFriends.AnyAsync(x => x.UserId == userId && x.FriendId == senderId))
            {
                _context.UserFriends.Add(new UserFriends { UserId = userId, FriendId = senderId });
            }

            if (!await _context.UserFriends.AnyAsync(x => x.UserId == senderId && x.FriendId == userId))
            {
                _context.UserFriends.Add(new UserFriends { UserId = senderId, FriendId = userId });
            }

            await _context.SaveChangesAsync();
        }

        public async Task DeclineFriendRequestAsync(Guid userId, Guid senderId)
        {
            var request = await _context.FriendRequests
                .FirstOrDefaultAsync(fr =>
                    fr.SenderId == senderId &&
                    fr.ReceiverId == userId &&
                    fr.Status == FriendRequestStatus.Pending)
                ?? throw new AppException(ErrorCode.FriendRequestNotFound);

            request.Status = FriendRequestStatus.Declined;
            await _context.SaveChangesAsync();
        }

        public async Task<List<UserResponse>> GetFriendsAsync(Guid userId, UserFilterRequest filter)
        {
            var query = _context.UserFriends
                .Where(x => x.UserId == userId)
                .Include(x => x.Friend)
                .Select(x => x.Friend)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(filter.Name))
            {
                var searchTerm = filter.Name.ToLower();

                query = query.Where(u =>
                    (u.UserName != null && u.UserName.ToLower().Contains(searchTerm)) ||
                    (u.Email != null && u.Email.ToLower().Contains(searchTerm))
                );
            }

            var friends = await query.ToListAsync();

            return friends.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<List<FriendRequestReceivedResponse>> GetFriendRequestsAsync(Guid userId)
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

            return requests.Select(MapperHelper.ToDtoSend).ToList();
        }
    }
}