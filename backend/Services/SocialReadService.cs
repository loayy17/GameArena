using backend.Data;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class SocialReadService(AppDbContext context, IUserPresenceService presence) : ISocialReadService
{
    public async Task<List<UserSummaryResponse>> GetFriendsAsync(Guid userId, UserFilterRequest? filter)
    {
        var blockedIds = await SocialQueryHelper.GetBlockedIdsAsync(context, userId);

        var query = context.UserFriends
            .AsNoTracking()
            .Where(x => x.UserId == userId && !blockedIds.Contains(x.FriendId))
            .Select(x => x.Friend);

        query = UserSearchQuery.Apply(query, filter?.Name);

        var users = await query
            .Select(MappingExtensions.ToSummaryProjection)
            .ToListAsync();

        return WithPresenceAndStatusFilter(users, filter?.UserStatus ?? UserStatus.All);
    }

    public async Task<List<FriendRequestReceivedResponse>> GetReceivedRequestsAsync(Guid userId)
    {
        return await context.FriendRequests
            .AsNoTracking()
            .Where(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending)
            .Select(fr => new FriendRequestReceivedResponse
            {
                SenderId = fr.SenderId,
                SenderFirstName = fr.Sender.FirstName,
                SenderLastName = fr.Sender.LastName,
                SenderFullName = fr.Sender.FirstName + " " + fr.Sender.LastName,
                SenderUserName = fr.Sender.UserName,
                SenderAvatarUrl = MappingExtensions.AvatarUrl(fr.Sender.Id, fr.Sender.Avatar),
                SentAt = fr.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<FriendRequestSentResponse>> GetSentRequestsAsync(Guid userId)
    {
        return await context.FriendRequests
            .AsNoTracking()
            .Where(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending)
            .Select(fr => new FriendRequestSentResponse
            {
                ReceiverId = fr.ReceiverId,
                ReceiverFirstName = fr.Receiver.FirstName,
                ReceiverLastName = fr.Receiver.LastName,
                ReceiverFullName = fr.Receiver.FirstName + " " + fr.Receiver.LastName,
                ReceiverUserName = fr.Receiver.UserName,
                ReceiverAvatarUrl = MappingExtensions.AvatarUrl(fr.Receiver.Id, fr.Receiver.Avatar),
                SentAt = fr.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<List<UserSummaryResponse>> GetBlockedUsersAsync(Guid userId)
    {
        var blocked = await context.Blocks
            .AsNoTracking()
            .Where(b => b.BlockerId == userId)
            .Select(b => b.Blocked)
            .Select(MappingExtensions.ToSummaryProjection)
            .ToListAsync();

        return WithPresenceAndStatusFilter(blocked, UserStatus.All);
    }

    public async Task<HashSet<Guid>> GetFriendIdsAsync(Guid userId)
    {
        var blockedIds = await SocialQueryHelper.GetBlockedIdsAsync(context, userId);

        return await context.UserFriends
            .AsNoTracking()
            .Where(uf => uf.UserId == userId && !blockedIds.Contains(uf.FriendId))
            .Select(uf => uf.FriendId)
            .ToHashSetAsync();
    }

    public Task<bool> AreFriendsAsync(Guid userId, Guid otherUserId) =>
        SocialQueryHelper.AreFriendsAsync(context, userId, otherUserId);

    private List<UserSummaryResponse> WithPresenceAndStatusFilter(List<UserSummaryResponse> users, UserStatus status)
    {
        var results = users.Select(u => u with { Status = presence.GetStatus(u.Id.ToString()) });

        return status == UserStatus.All
            ? [.. results]
            : [.. results.Where(u => u.Status == status)];
    }
}
