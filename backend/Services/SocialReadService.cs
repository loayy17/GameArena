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
                var searchTerm = filter.Name.ToLower();
                query = query.Where(u =>
                    u.UserName != null && u.UserName.ToLower().Contains(searchTerm));
            }

            return (await query.ToListAsync())
                .Select(user =>
                {
                    var dto = MapperHelper.ToDtoSummary(user);
                    dto.Status = _presence.GetStatus(user.Id.ToString());
                    return dto;
                })
                .ToList();
        }

        public async Task<List<FriendRequestReceivedResponse>> GetReceivedRequestsAsync(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();

            var requests = await context.FriendRequests
                .AsNoTracking()
                .Where(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending)
                .Include(u => u.Sender)
                .ToListAsync();

            return requests.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();

            var requests = await context.FriendRequests
                .AsNoTracking()
                .Where(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending)
                .Include(fr => fr.Receiver)
                .ToListAsync();

            return requests.Select(MapperHelper.ToSentRequestDto).ToList();
        }

        public async Task<List<UserSummaryResponse>> GetBlockedUsersAsync(Guid userId)
        {
            await using var context = await _contextFactory.CreateDbContextAsync();

            var blocked = await context.Blocks
                .AsNoTracking()
                .Where(b => b.BlockerId == userId)
                .Select(b => b.Blocked)
                .ToListAsync();

            return blocked
                .Select(user =>
                {
                    var dto = MapperHelper.ToDtoSummary(user);
                    dto.Status = _presence.GetStatus(user.Id.ToString());
                    return dto;
                })
                .ToList();
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
