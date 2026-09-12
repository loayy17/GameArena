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
        IChatService _chatService,
        ILogger<SocialHub> _logger) : Hub
    {
        private Guid? CurrentUserId =>
            Context.UserIdentifier is { Length: > 0 } id && Guid.TryParse(id, out var guid) ? guid : null;

        private Guid GetUserId() =>
            CurrentUserId ?? throw new HubException("Unauthorized");

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

        public async Task SendPrivateMessage(Guid receiverId, string message)
        {
            var senderId = GetUserId();
            var msg = await _chatService.CreatePrivateMessageAsync(senderId, receiverId, message);
            await Clients.Group($"user:{receiverId}").SendAsync("chat:private", msg);
        }

        public async Task SendTyping(Guid receiverId)
        {
            var senderId = GetUserId();
            var friendIds = await _socialReadService.GetFriendIdsAsync(senderId);
            if (!friendIds.Contains(receiverId)) return;
            await Clients.Group($"user:{receiverId}").SendAsync("chat:typing", new { senderId, receiverId });
        }

        public async Task RequestCounters()
            => await _notificationService.SendCountersAsync(GetUserId());

        public async Task RequestFriends()
            => await _notificationService.SendFriendsAsync(GetUserId());

        public async Task RequestFriendRequests()
            => await _notificationService.SendFriendRequestsAsync(GetUserId());

        public async Task RequestBlocked()
            => await _notificationService.SendBlockedAsync(GetUserId());

        public async Task RequestNotifications(int limit = 50)
        {
            var list = await _notificationService.GetNotificationsAsync(GetUserId(), limit);
            await Clients.Caller.SendAsync("notification:list", list);
        }

        public async Task MarkNotificationRead(Guid notificationId)
            => await MutateAndResendNotifications(GetUserId(), () => _notificationService.MarkNotificationAsReadAsync(GetUserId(), notificationId));

        public async Task MarkAllNotificationsRead()
            => await MutateAndResendNotifications(GetUserId(), () => _notificationService.MarkAllNotificationsAsReadAsync(GetUserId()));

        public async Task DeleteNotification(Guid notificationId)
            => await MutateAndResendNotifications(GetUserId(), () => _notificationService.DeleteNotificationAsync(GetUserId(), notificationId));

        private async Task MutateAndResendNotifications(Guid userId, Func<Task> mutation)
        {
            await mutation();
            var list = await _notificationService.GetNotificationsAsync(userId);
            await Clients.Caller.SendAsync("notification:list", list);
        }
    }
}
