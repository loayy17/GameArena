using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    [Authorize]
    public class SocialHub(
        IUserPresenceService _presence,
        INotificationService _notificationService,
        ISocialReadService _socialReadService,
        ILogger<SocialHub> _logger) : Hub
    {
        private Guid? CurrentUserId =>
            Context.UserIdentifier is { Length: > 0 } id && Guid.TryParse(id, out var guid) ? guid : null;

        public override async Task OnConnectedAsync()
        {
            if (CurrentUserId is { } userId)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
                var isFirstConnection = _presence.AddConnection(userId.ToString());

                if (isFirstConnection)
                {
                    var friendIds = await _socialReadService.GetFriendIdsAsync(userId);
                    foreach (var friendId in friendIds)
                    {
                        await Clients.Group($"user:{friendId}").SendAsync("friend:online", new { userId = userId.ToString() });
                    }
                }

                try
                {
                    await _notificationService.SendSocialDataAsync(userId);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to send social data to user {UserId} on connect", userId);
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (CurrentUserId is { } userId)
            {
                var isLastConnection = _presence.RemoveConnection(userId.ToString());

                if (isLastConnection)
                {
                    var friendIds = await _socialReadService.GetFriendIdsAsync(userId);
                    foreach (var friendId in friendIds)
                    {
                        await Clients.Group($"user:{friendId}").SendAsync("friend:offline", new { userId = userId.ToString() });
                    }
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task RequestCounters()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendCountersAsync(userId);
        }

        public async Task RequestFriends()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendFriendsAsync(userId);
        }

        public async Task RequestFriendRequests()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendFriendRequestsAsync(userId);
        }

        public async Task RequestBlocked()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendBlockedAsync(userId);
        }

        public async Task RequestSocialData()
        {
            if (CurrentUserId is { } userId)
                await _notificationService.SendSocialDataAsync(userId);
        }

        public async Task RequestNotifications(int limit = 50)
        {
            if (CurrentUserId is not { } userId) return;
            var list = await _notificationService.GetNotificationsAsync(userId, limit);
            await Clients.Caller.SendAsync("notification:list", list);
        }

        public async Task MarkNotificationRead(Guid notificationId)
        {
            if (CurrentUserId is not { } userId) return;
            await _notificationService.MarkNotificationAsReadAsync(userId, notificationId);
            var list = await _notificationService.GetNotificationsAsync(userId);
            await Clients.Caller.SendAsync("notification:list", list);
        }

        public async Task MarkAllNotificationsRead()
        {
            if (CurrentUserId is not { } userId) return;
            await _notificationService.MarkAllNotificationsAsReadAsync(userId);
            var list = await _notificationService.GetNotificationsAsync(userId);
            await Clients.Caller.SendAsync("notification:list", list);
        }

        public async Task DeleteNotification(Guid notificationId)
        {
            if (CurrentUserId is not { } userId) return;
            await _notificationService.DeleteNotificationAsync(userId, notificationId);
            var list = await _notificationService.GetNotificationsAsync(userId);
            await Clients.Caller.SendAsync("notification:list", list);
        }
    }
}
