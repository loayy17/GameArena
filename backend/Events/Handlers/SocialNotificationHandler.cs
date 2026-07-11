using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using Microsoft.AspNetCore.SignalR;

namespace backend.Events.Handlers;

public class SocialNotificationHandler(
    IHubContext<SocialHub> _hub,
    IUserPresenceService _presence,
    INotificationService _notificationService
) : IEventHandler<FriendRequestSentEvent>,
    IEventHandler<FriendRequestAcceptedEvent>,
    IEventHandler<FriendRequestDeclinedEvent>,
    IEventHandler<FriendRemovedEvent>,
    IEventHandler<ChatMessageSentEvent>,
    IEventHandler<GameStartedEvent>,
    IEventHandler<GameFinishedEvent>,
    IEventHandler<GameLeftEvent>,
    IEventHandler<UserBlockedEvent>,
    IEventHandler<FriendRequestCancelledEvent>
{
    public async Task HandleAsync(FriendRequestSentEvent eventHappen)
    {
        await _hub.Clients.User(eventHappen.ReceiverId.ToString())
            .SendAsync("friend:request", new
            {
                senderId = eventHappen.SenderId,
                senderName = eventHappen.SenderName
            });
        await _notificationService.SendCountersAsync(eventHappen.ReceiverId);
        await _notificationService.SendFriendRequestsAsync(eventHappen.ReceiverId);
    }

    public async Task HandleAsync(FriendRequestAcceptedEvent eventHappen)
    {
        await _hub.Clients.User(eventHappen.SenderId.ToString())
            .SendAsync("friend:accepted", new
            {
                friendId = eventHappen.AccepterId,
                friendName = eventHappen.AccepterName
            });
        await _notificationService.SendCountersAsync(eventHappen.SenderId);
        await _notificationService.SendFriendsAsync(eventHappen.SenderId);
        await _notificationService.SendFriendRequestsAsync(eventHappen.SenderId);
    }

    public async Task HandleAsync(FriendRequestDeclinedEvent eventHappen)
    {
        await _hub.Clients.User(eventHappen.SenderId.ToString())
            .SendAsync("friend:declined", new
            {
                userId = eventHappen.DeclinerId
            });
        await _notificationService.SendCountersAsync(eventHappen.SenderId);
        await _notificationService.SendFriendRequestsAsync(eventHappen.SenderId);
    }

    public async Task HandleAsync(FriendRemovedEvent eventHappen)
    {
        await _hub.Clients.User(eventHappen.RemovedFriendId.ToString())
            .SendAsync("friend:removed", new
            {
                userId = eventHappen.RemoverId
            });
        await _notificationService.SendCountersAsync(eventHappen.RemovedFriendId);
        await _notificationService.SendFriendsAsync(eventHappen.RemovedFriendId);
    }

    public async Task HandleAsync(ChatMessageSentEvent eventHappen)
    {
        await _hub.Clients.User(eventHappen.ReceiverId.ToString())
            .SendAsync("chat:notification", new
            {
                senderId = eventHappen.SenderId,
                receiverId = eventHappen.ReceiverId,
                content = eventHappen.Content,
                sentAt = eventHappen.SentAt
            });
        await _notificationService.SendCountersAsync(eventHappen.ReceiverId);
    }

    public async Task HandleAsync(GameStartedEvent eventHappen)
    {
        await SetPresenceAndBroadcastAsync(eventHappen.Player1Id, UserStatus.InGame, "friend:ingame");
        await SetPresenceAndBroadcastAsync(eventHappen.Player2Id, UserStatus.InGame, "friend:ingame");
    }

    public async Task HandleAsync(GameFinishedEvent eventHappen)
    {
        await SetPresenceAndBroadcastAsync(eventHappen.Player1Id, UserStatus.Online, "friend:online");
        await SetPresenceAndBroadcastAsync(eventHappen.Player2Id, UserStatus.Online, "friend:online");
    }

    public async Task HandleAsync(GameLeftEvent eventHappen)
    {
        await SetPresenceAndBroadcastAsync(eventHappen.PlayerId, UserStatus.Online, "friend:online");
    }
    public async Task HandleAsync(UserBlockedEvent eventHappen)
    {
        await _hub.Clients.User(eventHappen.BlockedUserId.ToString())
            .SendAsync("friend:blocked", new
            {
                userId = eventHappen.BlockerId
            });
        await _notificationService.SendFriendsAsync(eventHappen.BlockedUserId);
        await _notificationService.SendCountersAsync(eventHappen.BlockedUserId);
        await _notificationService.SendBlockedAsync(eventHappen.BlockerId);
        await _notificationService.SendCountersAsync(eventHappen.BlockerId);
    }
    public async Task HandleAsync(FriendRequestCancelledEvent eventHappen)
    {
        await _hub.Clients.User(eventHappen.ReceiverId.ToString())
            .SendAsync("friend:requestCancelled", new
            {
                senderId = eventHappen.SenderId
            });

        await _notificationService.SendFriendRequestsAsync(eventHappen.SenderId);
        await _notificationService.SendFriendRequestsAsync(eventHappen.ReceiverId);
        await _notificationService.SendCountersAsync(eventHappen.SenderId);
        await _notificationService.SendCountersAsync(eventHappen.ReceiverId);
    }

    private async Task SetPresenceAndBroadcastAsync(string userId, UserStatus status, string eventName)
    {
        if (string.IsNullOrEmpty(userId) || userId == "__BOT__") return;
        if (status == UserStatus.InGame)
            _presence.SetInGame(userId);
        else
            _presence.SetOnline(userId);
        await _hub.Clients.All.SendAsync(eventName, new { userId });
    }
}
