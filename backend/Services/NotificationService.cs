using System.Data;
using backend.Data;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class NotificationService(
        IHubContext<SocialHub> hub,
        IFriendService friendService,
        AppDbContext context) : INotificationService
    {
        public async Task<NotificationCountersResponse> GetCountersAsync(Guid userId)
        {
            var connection = context.Database.GetDbConnection();
            var wasClosed = connection.State != ConnectionState.Open;
            if (wasClosed) await connection.OpenAsync();

            try
            {
                await using var cmd = connection.CreateCommand();
                cmd.CommandText = @"
                    SELECT
                        (SELECT COUNT(*) FROM ""FriendRequests"" WHERE ""ReceiverId"" = @userId AND ""Status"" = @pendingStatus) AS friend_requests,
                        (SELECT COUNT(*) FROM ""UserFriends"" WHERE ""UserId"" = @userId) AS friends,
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
                    FriendRequests = reader.GetInt32(0),
                    Friends = reader.GetInt32(1),
                    UnreadMessages = reader.GetInt32(2)
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
            var friends = await friendService.GetFriendsAsync(userId, null);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:friends", friends);
        }

        public async Task SendFriendRequestsAsync(Guid userId)
        {
            var received = await friendService.GetReceivedRequestsAsync(userId);
            var sent = await friendService.GetSentRequestsAsync(userId);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:requests", new { received, sent });
        }

        public async Task SendBlockedAsync(Guid userId)
        {
            var blocked = await friendService.GetBlockedUsersAsync(userId);
            await hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:blocked", blocked);
        }


        public async Task SendSocialDataAsync(Guid userId)
        {
            await SendCountersAsync(userId);
            await SendFriendsAsync(userId);
            await SendFriendRequestsAsync(userId);
            await SendBlockedAsync(userId);
        }
    }
}