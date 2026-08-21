using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class NotificationService(
        IHubContext<SocialHub> hub,
        ISocialReadService socialReadService,
        IDbContextFactory<AppDbContext> contextFactory,
        ILogger<NotificationService> logger) : INotificationService
    {
        public async Task<NotificationCountersResponse> GetCountersAsync(Guid userId)
        {
            var receivedTask = CountReceivedRequestsAsync(userId);
            var sentTask = CountSentRequestsAsync(userId);
            var friendsTask = CountFriendsAsync(userId);
            var unreadTask = CountUnreadMessagesAsync(userId);

            await Task.WhenAll(receivedTask, sentTask, friendsTask, unreadTask);

            return new NotificationCountersResponse
            {
                ReceivedFriendRequests = await receivedTask,
                SentFriendRequests = await sentTask,
                Friends = await friendsTask,
                UnreadMessages = await unreadTask
            };
        }

        private async Task<int> CountReceivedRequestsAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            return await context.FriendRequests
                .CountAsync(fr => fr.ReceiverId == userId && fr.Status == FriendRequestStatus.Pending);
        }

        private async Task<int> CountSentRequestsAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            return await context.FriendRequests
                .CountAsync(fr => fr.SenderId == userId && fr.Status == FriendRequestStatus.Pending);
        }

        private async Task<int> CountFriendsAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            return await context.UserFriends
                .CountAsync(uf => uf.UserId == userId && !context.Blocks.Any(b =>
                    (b.BlockerId == userId && b.BlockedId == uf.FriendId) ||
                    (b.BlockedId == userId && b.BlockerId == uf.FriendId)));
        }

        private async Task<int> CountUnreadMessagesAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            return await context.Messages
                .CountAsync(m => m.ReceiverId == userId && !m.IsRead);
        }

        public async Task SendCountersAsync(Guid userId)
        {
            var counters = await GetCountersAsync(userId);

            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("notification:update", counters);
        }

        public async Task SendFriendsAsync(Guid userId)
        {
            var friends = await socialReadService.GetFriendsAsync(userId, null);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:friends", friends);
        }

        public async Task SendFriendRequestsAsync(Guid userId)
        {
            var received = await socialReadService.GetReceivedRequestsAsync(userId);
            var sent = await socialReadService.GetSentRequestsAsync(userId);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:requests", new { received, sent });
        }

        public async Task SendBlockedAsync(Guid userId)
        {
            var blocked = await socialReadService.GetBlockedUsersAsync(userId);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:blocked", blocked);
        }

        public async Task SendSocialDataAsync(Guid userId)
        {
            var friendsTask = socialReadService.GetFriendsAsync(userId, null);
            var receivedTask = socialReadService.GetReceivedRequestsAsync(userId);
            var sentTask = socialReadService.GetSentRequestsAsync(userId);
            var blockedTask = socialReadService.GetBlockedUsersAsync(userId);
            var countersTask = GetCountersAsync(userId);

            await Task.WhenAll(friendsTask, receivedTask, sentTask, blockedTask, countersTask);

            var batch = new SocialDataBatchResponse
            {
                Friends = await friendsTask,
                ReceivedRequests = await receivedTask,
                SentRequests = await sentTask,
                BlockedUsers = await blockedTask,
                Counters = await countersTask
            };

            try
            {
                await hub.Clients
                    .Group($"user:{userId}")
                    .SendAsync("social:all", batch);
            }
            catch (Exception ex)
            {
                logger.LogWarning("Failed to send social data to user {UserId}: {Message}", userId, ex.Message);
            }
        }

        public async Task<List<NotificationResponse>> GetNotificationsAsync(Guid userId, int limit = 50)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            var notifications = await context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit)
                .AsNoTracking()
                .ToListAsync();

            return notifications.Select(n => n.ToResponse()).ToList();
        }

        public async Task<NotificationResponse> CreateNotificationAsync(Guid userId, string type, string title, string body, string? referenceId = null)
        {
            await using var context = await contextFactory.CreateDbContextAsync();

            if (!Enum.TryParse<NotificationType>(type, true, out var notificationType))
                throw new ArgumentException($"Invalid notification type: {type}", nameof(type));

            var notification = new Notification
            {
                UserId = userId,
                Type = notificationType,
                Title = title,
                Body = body,
                ReferenceId = referenceId,
                IsRead = false,
                CreatedAt = DateTime.UtcNow
            };

            context.Notifications.Add(notification);
            await context.SaveChangesAsync();

            var response = notification.ToResponse();

            try
            {
                await hub.Clients
                    .Group($"user:{userId}")
                    .SendAsync("notification:new", response);
            }
            catch (Exception ex)
            {
                logger.LogWarning("Failed to push notification:new to user {UserId}: {Message}", userId, ex.Message);
            }

            return response;
        }

        public async Task MarkNotificationAsReadAsync(Guid userId, Guid notificationId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            await context.Notifications
                .Where(n => n.Id == notificationId && n.UserId == userId)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
        }

        public async Task MarkAllNotificationsAsReadAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            await context.Notifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
        }

        public async Task DeleteNotificationAsync(Guid userId, Guid notificationId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            await context.Notifications
                .Where(n => n.Id == notificationId && n.UserId == userId)
                .ExecuteDeleteAsync();
        }
    }
}
