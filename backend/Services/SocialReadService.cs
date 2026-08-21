using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class SocialReadService(
        IDbContextFactory<AppDbContext> _contextFactory,
        IUserPresenceService _presence) : ISocialReadService
    {
        public async Task<List<UserSummaryResponse>> GetFriendsAsync(Guid userId, UserFilterRequest? filter)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            var blockedIds = await GetBlockedIdsAsync(context, userId);

            var query = context.UserFriends
                .AsNoTracking()
                .Where(x => x.UserId == userId && !blockedIds.Contains(x.FriendId))
                .Select(x => x.Friend);

            if (filter != null && !string.IsNullOrWhiteSpace(filter.Name))
            {
                var searchTerm = filter.Name.Trim();
                query = query.Where(u =>
                    EF.Functions.ILike(u.UserName, $"%{searchTerm}%") ||
                    EF.Functions.ILike(u.FirstName, $"%{searchTerm}%") ||
                    EF.Functions.ILike(u.LastName, $"%{searchTerm}%"));
            }

            var users = await query
                .Select(u => new UserSummaryResponse(u.Id, u.UserName, u.FirstName, u.LastName, u.Status, MappingExtensions.AvatarUrl(u.Id, u.Avatar)))
                .ToListAsync();

            var result = users.Select(u => u with { Status = _presence.GetStatus(u.Id.ToString()) }).ToList();

            if (filter != null && filter.UserStatus != UserStatus.All)
                result = result.Where(u => u.Status == filter.UserStatus).ToList();
            return result;
        }

        public async Task<List<FriendRequestReceivedResponse>> GetReceivedRequestsAsync(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();

            return await context.FriendRequests
                .AsNoTracking()
                .Where(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending)
                .Select(fr => new FriendRequestReceivedResponse
                {
                    SenderId = fr.SenderId,
                    SenderFirstName = fr.Sender.FirstName,
                    SenderLastName = fr.Sender.LastName,
                    SenderUserName = fr.Sender.UserName,
                    SenderAvatarUrl = MappingExtensions.AvatarUrl(fr.Sender.Id, fr.Sender.Avatar),
                    SentAt = fr.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();

            return await context.FriendRequests
                .AsNoTracking()
                .Where(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending)
                .Select(fr => new FriendRequestSentResponse
                {
                    ReceiverId = fr.ReceiverId,
                    ReceiverFirstName = fr.Receiver.FirstName,
                    ReceiverLastName = fr.Receiver.LastName,
                    ReceiverUserName = fr.Receiver.UserName,
                    ReceiverAvatarUrl = MappingExtensions.AvatarUrl(fr.Receiver.Id, fr.Receiver.Avatar),
                    SentAt = fr.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<List<UserSummaryResponse>> GetBlockedUsersAsync(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();

            var blocked = await context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId)
                .Select(b => new UserSummaryResponse(b.Blocked.Id, b.Blocked.UserName, b.Blocked.FirstName, b.Blocked.LastName, b.Blocked.Status, MappingExtensions.AvatarUrl(b.Blocked.Id, b.Blocked.Avatar)))
                .ToListAsync();

            return blocked.Select(u => u with { Status = _presence.GetStatus(u.Id.ToString()) }).ToList();
        }

        public async Task<HashSet<Guid>> GetFriendIdsAsync(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();
            var blockedIds = await GetBlockedIdsAsync(context, userId);

            return await context.UserFriends
                .AsNoTracking()
                .Where(uf => uf.UserId == userId && !blockedIds.Contains(uf.FriendId))
                .Select(uf => uf.FriendId)
                .ToHashSetAsync();
        }

        private static async Task<HashSet<Guid>> GetBlockedIdsAsync(AppDbContext context, Guid userId)
        {
            return await context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId || b.BlockedId == userId)
                .Select(b => b.BlockerId == userId ? b.BlockedId : b.BlockerId)
                .ToHashSetAsync();
        }
    }
}
