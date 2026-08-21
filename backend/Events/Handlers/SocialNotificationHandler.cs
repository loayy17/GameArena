using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using Microsoft.AspNetCore.SignalR;

namespace backend.Events.Handlers;

public class SocialNotificationHandler(
    IHubContext<SocialHub> _hub,
    IUserPresenceService _presence,
    INotificationService _notificationService,
    ISocialReadService _socialReadService,
    IUserService _userService
) : IEventHandler<FriendRequestSentEvent>,
    IEventHandler<FriendRequestAcceptedEvent>,
    IEventHandler<FriendRequestDeclinedEvent>,
    IEventHandler<FriendRemovedEvent>,
    IEventHandler<ChatMessageSentEvent>,
    IEventHandler<GameStartedEvent>,
    IEventHandler<GameFinishedEvent>,
    IEventHandler<GameLeftEvent>,
    IEventHandler<UserBlockedEvent>,
    IEventHandler<UserUnblockedEvent>,
    IEventHandler<FriendRequestCancelledEvent>,
    IEventHandler<GameInviteSentEvent>
{
    public async Task HandleAsync(FriendRequestSentEvent eventHappen)
    {
        await _hub.Clients.Group($"user:{eventHappen.ReceiverId}")
            .SendAsync("friend:request", new
            {
                senderId = eventHappen.SenderId,
                senderName = eventHappen.SenderName
            });

        await _notificationService.CreateNotificationAsync(
            eventHappen.ReceiverId,
            "FriendRequest",
            "Friend Request",
            $"{eventHappen.SenderName} sent you a friend request",
            eventHappen.SenderId.ToString()
        );

        await NotifyRequestChangeAsync(eventHappen.SenderId, eventHappen.ReceiverId);
    }

    public async Task HandleAsync(FriendRequestAcceptedEvent eventHappen)
    {
        await _hub.Clients.Group($"user:{eventHappen.SenderId}")
            .SendAsync("friend:accepted", new
            {
                friendId = eventHappen.AccepterId,
                friendName = eventHappen.AccepterName
            });

        await _notificationService.CreateNotificationAsync(
            eventHappen.SenderId,
            "FriendRequestAccepted",
            "Friend Request Accepted",
            $"{eventHappen.AccepterName} accepted your friend request",
            eventHappen.AccepterId.ToString()
        );

        await Task.WhenAll(
            _notificationService.SendCountersAsync(eventHappen.SenderId),
            _notificationService.SendFriendsAsync(eventHappen.SenderId),
            _notificationService.SendFriendRequestsAsync(eventHappen.SenderId),
            _notificationService.SendCountersAsync(eventHappen.AccepterId),
            _notificationService.SendFriendsAsync(eventHappen.AccepterId),
            _notificationService.SendFriendRequestsAsync(eventHappen.AccepterId)
        );
    }

    public async Task HandleAsync(FriendRequestDeclinedEvent eventHappen)
    {
        await _hub.Clients.Group($"user:{eventHappen.SenderId}")
            .SendAsync("friend:declined", new
            {
                userId = eventHappen.DeclinerId
            });

        await NotifyRequestChangeAsync(eventHappen.SenderId, eventHappen.DeclinerId);
    }

    public async Task HandleAsync(FriendRemovedEvent eventHappen)
    {
        await _hub.Clients.Group($"user:{eventHappen.RemovedFriendId}")
            .SendAsync("friend:removed", new
            {
                userId = eventHappen.RemoverId
            });

        await Task.WhenAll(
            _notificationService.SendCountersAsync(eventHappen.RemovedFriendId),
            _notificationService.SendFriendsAsync(eventHappen.RemovedFriendId),
            _notificationService.SendCountersAsync(eventHappen.RemoverId),
            _notificationService.SendFriendsAsync(eventHappen.RemoverId)
        );
    }

    public async Task HandleAsync(ChatMessageSentEvent eventHappen)
    {
        await _hub.Clients.Group($"user:{eventHappen.ReceiverId}")
            .SendAsync("chat:notification", new
            {
                senderId = eventHappen.SenderId,
                receiverId = eventHappen.ReceiverId,
                content = eventHappen.Content,
                sentAt = eventHappen.SentAt
            });

        var preview = eventHappen.Content.Length > 50
            ? eventHappen.Content[..50] + "..."
            : eventHappen.Content;

        await _notificationService.CreateNotificationAsync(
            eventHappen.ReceiverId,
            "NewMessage",
            "New Message",
            preview,
            eventHappen.SenderId.ToString()
        );

        await _notificationService.SendCountersAsync(eventHappen.ReceiverId);
    }

    public async Task HandleAsync(GameInviteSentEvent eventHappen)
    {
        if (!Guid.TryParse(eventHappen.ReceiverId, out var receiverId)) return;

        await _notificationService.CreateNotificationAsync(
            receiverId,
            "GameInvite",
            "Game Invite",
            $"{eventHappen.InviterName} invited you to play {eventHappen.GameType}",
            eventHappen.RoomId
        );
    }

    public async Task HandleAsync(GameStartedEvent eventHappen)
    {
        if (Guid.TryParse(eventHappen.Player1Id, out var p1))
            await SetPresenceAndBroadcastAsync(p1, UserStatus.InGame, "friend:ingame");
        if (Guid.TryParse(eventHappen.Player2Id, out var p2))
            await SetPresenceAndBroadcastAsync(p2, UserStatus.InGame, "friend:ingame");
    }

    public async Task HandleAsync(GameFinishedEvent eventHappen)
    {
        if (Guid.TryParse(eventHappen.Player1Id, out var p1))
            await SetPresenceAndBroadcastAsync(p1, UserStatus.Online, "friend:online");
        if (Guid.TryParse(eventHappen.Player2Id, out var p2))
            await SetPresenceAndBroadcastAsync(p2, UserStatus.Online, "friend:online");
        if (Guid.TryParse(eventHappen.Player1Id, out var r1) && Guid.TryParse(eventHappen.Player2Id, out var r2))
            await _userService.UpdateRanksAsync(r1, r2, eventHappen.Player1Score, eventHappen.Player2Score);
    }

    public async Task HandleAsync(GameLeftEvent eventHappen)
    {
        if (Guid.TryParse(eventHappen.PlayerId, out var p))
            await SetPresenceAndBroadcastAsync(p, UserStatus.Online, "friend:online");
    }

    public async Task HandleAsync(UserBlockedEvent eventHappen)
    {
        await Task.WhenAll(
            _hub.Clients.Group($"user:{eventHappen.BlockedUserId}")
                .SendAsync("friend:blocked", new { userId = eventHappen.BlockerId }),
            _notificationService.SendSocialDataAsync(eventHappen.BlockedUserId),
            _notificationService.SendSocialDataAsync(eventHappen.BlockerId)
        );
    }

    public async Task HandleAsync(UserUnblockedEvent eventHappen)
    {
        await Task.WhenAll(
            _notificationService.SendSocialDataAsync(eventHappen.BlockedUserId),
            _notificationService.SendSocialDataAsync(eventHappen.BlockerId)
        );
    }

    public async Task HandleAsync(FriendRequestCancelledEvent eventHappen)
    {
        await _hub.Clients.Group($"user:{eventHappen.ReceiverId}")
            .SendAsync("friend:requestCancelled", new
            {
                senderId = eventHappen.SenderId
            });

        await NotifyRequestChangeAsync(eventHappen.SenderId, eventHappen.ReceiverId);
    }

    private async Task NotifyRequestChangeAsync(Guid userA, Guid userB)
    {
        await Task.WhenAll(
            _notificationService.SendCountersAsync(userA),
            _notificationService.SendFriendRequestsAsync(userA),
            _notificationService.SendCountersAsync(userB),
            _notificationService.SendFriendRequestsAsync(userB)
        );
    }

    private async Task SetPresenceAndBroadcastAsync(Guid userId, UserStatus status, string eventName)
    {
        if (userId == Guid.Empty) return;

        if (!_presence.SetActivity(userId.ToString(), status)) return;

        var friendIds = await _socialReadService.GetFriendIdsAsync(userId);
        foreach (var friendId in friendIds)
        {
            await _hub.Clients.Group($"user:{friendId}").SendAsync(eventName, new { userId = userId.ToString() });
        }
    }
}
