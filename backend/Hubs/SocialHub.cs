using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

[Authorize]
public class SocialHub(
    IUserPresenceService presence,
    INotificationService notifications,
    ISocialReadService socialRead,
    IChatService chat,
    ILogger<SocialHub> logger) : Hub
{
    public override async Task OnConnectedAsync()
    {
        if (CurrentUserId is { } userId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
            if (presence.AddConnection(userId.ToString())) await BroadcastPresenceAsync(userId, "friend:online");
            try
            {
                await notifications.SendSocialDataAsync(userId);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Could not send social data to user {UserId} on connect", userId);
            }
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (CurrentUserId is { } userId
            && presence.RemoveConnection(userId.ToString()))
        {
            await BroadcastPresenceAsync(userId, "friend:offline");
        }

        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendPrivateMessage(Guid receiverId, string message)
    {
        var senderId = GetUserId();
        var sent = await chat.CreatePrivateMessageAsync(senderId, receiverId, message);
        await Clients.User(receiverId.ToString()).SendAsync("chat:private", sent);
        await Clients.User(senderId.ToString()).SendAsync("chat:private", sent);
    }

    public async Task SendTyping(Guid receiverId)
    {
        var senderId = GetUserId();
        if (!await socialRead.AreFriendsAsync(senderId, receiverId)) return;
        await Clients.Group($"user:{receiverId}").SendAsync("chat:typing", new { senderId, receiverId });
    }

    public Task RequestCounters() => notifications.SendCountersAsync(GetUserId());

    public Task RequestFriends() => notifications.SendFriendsAsync(GetUserId());

    public Task RequestFriendRequests() => notifications.SendFriendRequestsAsync(GetUserId());

    public Task RequestBlocked() => notifications.SendBlockedAsync(GetUserId());

    public async Task RequestNotifications(int limit = 50)
    {
        var userId = GetUserId();
        var list = await notifications.GetNotificationsAsync(userId, limit);
        await Clients.Caller.SendAsync("notification:list", list);
    }

    public Task MarkNotificationRead(Guid notificationId) =>
        MutateThenResendAsync(userId => notifications.MarkNotificationAsReadAsync(userId, notificationId));

    public Task MarkAllNotificationsRead() =>
        MutateThenResendAsync(userId => notifications.MarkAllNotificationsAsReadAsync(userId));

    public Task DeleteNotification(Guid notificationId) =>
        MutateThenResendAsync(userId => notifications.DeleteNotificationAsync(userId, notificationId));

    private Guid? CurrentUserId =>
        Guid.TryParse(Context.UserIdentifier, out var id) ? id : null;

    private Guid GetUserId() =>
        CurrentUserId ?? throw new HubException("Unauthorized");

    private async Task BroadcastPresenceAsync(Guid userId, string eventName)
    {
        var friendIds = await socialRead.GetFriendIdsAsync(userId);

        foreach (var friendId in friendIds)
        {
            await Clients.Group($"user:{friendId}").SendAsync(eventName, new { userId = userId.ToString() });
        }
    }

    private async Task MutateThenResendAsync(Func<Guid, Task> mutation)
    {
        var userId = GetUserId();
        await mutation(userId);
        var list = await notifications.GetNotificationsAsync(userId);
        await Clients.Caller.SendAsync("notification:list", list);
    }
}
