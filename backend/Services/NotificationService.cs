using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class NotificationService(
    AppDbContext context,
    ISocialReadService socialRead,
    IHubContext<SocialHub> hub,
    ILogger<NotificationService> logger) : INotificationService
{
    public async Task<NotificationCountersResponse> GetCountersAsync(Guid userId)
    {
        var received = await context.FriendRequests
            .CountAsync(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending);
        var sent = await context.FriendRequests
            .CountAsync(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending);
        var friends = await context.UserFriends
            .CountAsync(uf => uf.UserId == userId && !context.Blocks.Any(b =>
                (b.BlockerId == userId && b.BlockedId == uf.FriendId) ||
                (b.BlockedId == userId && b.BlockerId == uf.FriendId)));

        var unread = await context.Messages
            .CountAsync(m => m.ReceiverId == userId && !m.IsRead);

        return new NotificationCountersResponse
        {
            ReceivedFriendRequests = received,
            SentFriendRequests = sent,
            Friends = friends,
            UnreadMessages = unread
        };
    }

    public async Task SendCountersAsync(Guid userId)
    {
        var counters = await GetCountersAsync(userId);
        await PushAsync(userId, () => hub.Clients.Group(UserGroup(userId)).SendAsync("notification:update", counters));
    }

    public async Task SendFriendsAsync(Guid userId)
    {
        var friends = await socialRead.GetFriendsAsync(userId, null);
        await PushAsync(userId, () => hub.Clients.Group(UserGroup(userId)).SendAsync("social:friends", friends));
    }

    public async Task SendFriendRequestsAsync(Guid userId)
    {
        var received = await socialRead.GetReceivedRequestsAsync(userId);
        var sent = await socialRead.GetSentRequestsAsync(userId);
        await PushAsync(userId, () => hub.Clients.Group(UserGroup(userId)).SendAsync("social:requests", new { received, sent }));
    }

    public async Task SendBlockedAsync(Guid userId)
    {
        var blocked = await socialRead.GetBlockedUsersAsync(userId);
        await PushAsync(userId, () => hub.Clients.Group(UserGroup(userId)).SendAsync("social:blocked", blocked));
    }

    public async Task SendSocialDataAsync(Guid userId)
    {
        var friends = await socialRead.GetFriendsAsync(userId, null);
        var receivedRequests = await socialRead.GetReceivedRequestsAsync(userId);
        var sentRequests = await socialRead.GetSentRequestsAsync(userId);
        var blockedUsers = await socialRead.GetBlockedUsersAsync(userId);
        var counters = await GetCountersAsync(userId);

        var batch = new SocialDataBatchResponse
        {
            Friends = friends,
            ReceivedRequests = receivedRequests,
            SentRequests = sentRequests,
            BlockedUsers = blockedUsers,
            Counters = counters
        };

        await PushAsync(userId, () => hub.Clients.Group(UserGroup(userId)).SendAsync("social:all", batch));
    }

    public async Task<List<NotificationResponse>> GetNotificationsAsync(Guid userId, int limit = 50)
    {
        var notifications = await context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(limit)
            .AsNoTracking()
            .ToListAsync();

        return [.. notifications.Select(n => n.ToResponse())];
    }

    public async Task<NotificationResponse> CreateNotificationAsync(Guid userId, NotificationType type, string title, string body, string? referenceId = null)
    {
        var notification = new Notification
        {
            UserId = userId,
            Type = type,
            Title = title,
            Body = body,
            ReferenceId = referenceId,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        context.Notifications.Add(notification);
        await context.SaveChangesAsync();

        var response = notification.ToResponse();
        await PushAsync(userId, () => hub.Clients.Group(UserGroup(userId)).SendAsync("notification:new", response));

        return response;
    }

    public async Task MarkNotificationAsReadAsync(Guid userId, Guid notificationId)
    {
        await context.Notifications
            .Where(n => n.Id == notificationId && n.UserId == userId)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
    }

    public async Task MarkAllNotificationsAsReadAsync(Guid userId)
    {
        await context.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
    }

    public async Task DeleteNotificationAsync(Guid userId, Guid notificationId)
    {
        await context.Notifications
            .Where(n => n.Id == notificationId && n.UserId == userId)
            .ExecuteDeleteAsync();
    }

    public async Task DeleteNotificationsByReferenceAsync(Guid userId, NotificationType type, string referenceId)
    {
        var deleted = await context.Notifications
            .Where(n => n.UserId == userId && n.Type == type && n.ReferenceId == referenceId)
            .ExecuteDeleteAsync();

        if (deleted > 0) await SendNotificationListAsync(userId);
    }

    public async Task ReplaceUnreadNewMessageAsync(Guid userId, string title, string body, string referenceId)
    {
        await context.Notifications
            .Where(n => n.UserId == userId
                        && n.Type == NotificationType.NewMessage
                        && n.ReferenceId == referenceId
                        && !n.IsRead)
            .ExecuteDeleteAsync();

        await CreateNotificationAsync(userId, NotificationType.NewMessage, title, body, referenceId);
    }

    public async Task SendNotificationListAsync(Guid userId)
    {
        var list = await GetNotificationsAsync(userId);
        await PushAsync(userId, () => hub.Clients.Group(UserGroup(userId)).SendAsync("notification:list", list));
    }

    private async Task PushAsync(Guid userId, Func<Task> send)
    {
        try
        {
            await send();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Could not push to user {UserId}", userId);
        }
    }

    private static string UserGroup(Guid userId) => $"user:{userId}";
}
