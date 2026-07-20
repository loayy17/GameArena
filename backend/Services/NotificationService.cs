using System.Data;
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
        IDbContextFactory<AppDbContext> contextFactory) : INotificationService
    {
        public async Task<NotificationCountersResponse> GetCountersAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            var connection = context.Database.GetDbConnection();
            var wasClosed = connection.State != ConnectionState.Open;
            if (wasClosed) await connection.OpenAsync();

            try
            {
                await using var cmd = connection.CreateCommand();
                cmd.CommandText = @"
                    SELECT
                        (SELECT COUNT(*) FROM ""FriendRequests"" WHERE ""ReceiverId"" = @userId AND ""Status"" = @pendingStatus) AS received_requests,
                        (SELECT COUNT(*) FROM ""FriendRequests"" WHERE ""SenderId"" = @userId AND ""Status"" = @pendingStatus) AS sent_requests,
                        (SELECT COUNT(*) FROM ""UserFriends"" uf WHERE uf.""UserId"" = @userId AND NOT EXISTS (SELECT 1 FROM ""Blocks"" b WHERE (b.""BlockerId"" = @userId AND b.""BlockedId"" = uf.""FriendId"") OR (b.""BlockerId"" = uf.""FriendId"" AND b.""BlockedId"" = @userId))) AS friends,
                        (SELECT COUNT(*) FROM ""Messages"" WHERE ""ReceiverId"" = @userId AND ""IsRead"" = false) AS unread_messages;";

                var userIdParam = cmd.CreateParameter();
                userIdParam.ParameterName = "userId";
                userIdParam.Value = userId;
                cmd.Parameters.Add(userIdParam);

                var statusParam = cmd.CreateParameter();
                statusParam.ParameterName = "pendingStatus";
                statusParam.Value = (int)FriendRequestStatus.Pending;
                cmd.Parameters.Add(statusParam);

                await using var reader = await cmd.ExecuteReaderAsync();
                await reader.ReadAsync();

                return new NotificationCountersResponse
                {
                    ReceivedFriendRequests = reader.GetInt32(0),
                    SentFriendRequests = reader.GetInt32(1),
                    Friends = reader.GetInt32(2),
                    UnreadMessages = reader.GetInt32(3)
                };
            }
            finally
            {
                if (wasClosed) await connection.CloseAsync();
            }
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


        public Task SendSocialDataAsync(Guid userId) => Task.WhenAll(
            SendCountersAsync(userId),
            SendFriendsAsync(userId),
            SendFriendRequestsAsync(userId),
            SendBlockedAsync(userId)
        );

        public async Task<List<NotificationResponse>> GetNotificationsAsync(Guid userId, int limit = 50)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            var notifications = await context.Notifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Take(limit)
                .AsNoTracking()
                .ToListAsync();

            return notifications.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<int> GetUnreadNotificationCountAsync(Guid userId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            return await context.Notifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<NotificationResponse> CreateNotificationAsync(Guid userId, string type, string title, string body, string? referenceId = null)
        {
            await using var context = await contextFactory.CreateDbContextAsync();

            if (!Enum.TryParse<NotificationType>(type, true, out var notificationType))
                notificationType = NotificationType.FriendRequest;

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

            var response = MapperHelper.ToDto(notification);

            try
            {
                await hub.Clients
                    .Group($"user:{userId}")
                    .SendAsync("notification:new", response);
            }
            catch
            {
                // fire-and-forget; SignalR push is best-effort
            }

            return response;
        }

        public async Task MarkNotificationAsReadAsync(Guid userId, Guid notificationId)
        {
            await using var context = await contextFactory.CreateDbContextAsync();
            var notification = await context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.UserId == userId);
            if (notification != null)
            {
                notification.IsRead = true;
                await context.SaveChangesAsync();
            }
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
