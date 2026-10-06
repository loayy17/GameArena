using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;

namespace backend.Events.Handlers;

public class SocialNotificationHandler(
    IHubContext<SocialHub> hub,
    IUserPresenceService presence,
    INotificationService notifications,
    ISocialReadService socialRead,
    IUserService users
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
    IEventHandler<GameInviteSentEvent>,
    IEventHandler<GameInviteCancelledEvent>
{
    public async Task HandleAsync(FriendRequestSentEvent eventHappen)
    {
        await hub.Clients.Group(UserGroup(eventHappen.ReceiverId)).SendAsync("friend:request", new
        {
            senderId = eventHappen.SenderId,
            senderName = eventHappen.SenderName
        });

        await notifications.CreateNotificationAsync(
            eventHappen.ReceiverId,
            NotificationType.FriendRequest,
            "Friend Request",
            $"{eventHappen.SenderName} sent you a friend request",
            eventHappen.SenderId.ToString());

        await RefreshRequestsAsync(eventHappen.SenderId, eventHappen.ReceiverId);
    }

    public async Task HandleAsync(FriendRequestAcceptedEvent eventHappen)
    {
        await hub.Clients.Group(UserGroup(eventHappen.SenderId)).SendAsync("friend:accepted", new
        {
            friendId = eventHappen.AccepterId,
            friendName = eventHappen.AccepterName
        });

        await notifications.DeleteNotificationsByReferenceAsync(
            eventHappen.AccepterId,
            NotificationType.FriendRequest,
            eventHappen.SenderId.ToString());

        await notifications.CreateNotificationAsync(
            eventHappen.SenderId,
            NotificationType.FriendRequestAccepted,
            "Friend Request Accepted",
            $"{eventHappen.AccepterName} accepted your friend request",
            eventHappen.AccepterId.ToString());

        await RefreshFriendsAsync(eventHappen.SenderId);
        await RefreshFriendsAsync(eventHappen.AccepterId);
        await RefreshRequestsAsync(eventHappen.SenderId, eventHappen.AccepterId);
    }

    public async Task HandleAsync(FriendRequestDeclinedEvent eventHappen)
    {
        await hub.Clients.Group(UserGroup(eventHappen.SenderId)).SendAsync("friend:declined", new { userId = eventHappen.DeclinerId });

        await notifications.DeleteNotificationsByReferenceAsync(
            eventHappen.DeclinerId,
            NotificationType.FriendRequest,
            eventHappen.SenderId.ToString());

        await RefreshRequestsAsync(eventHappen.SenderId, eventHappen.DeclinerId);
    }

    public async Task HandleAsync(FriendRemovedEvent eventHappen)
    {
        await hub.Clients.Group(UserGroup(eventHappen.RemovedFriendId)).SendAsync("friend:removed", new { userId = eventHappen.RemoverId });

        await RefreshFriendsAsync(eventHappen.RemoverId);
        await RefreshFriendsAsync(eventHappen.RemovedFriendId);
    }

    public async Task HandleAsync(ChatMessageSentEvent eventHappen)
    {
        await hub.Clients.Group(UserGroup(eventHappen.ReceiverId)).SendAsync("chat:notification", new
        {
            senderId = eventHappen.SenderId,
            receiverId = eventHappen.ReceiverId,
            content = eventHappen.Content,
            sentAt = eventHappen.SentAt
        });

        await notifications.ReplaceUnreadNewMessageAsync(
            eventHappen.ReceiverId,
            "New Message",
            Preview(eventHappen.Content),
            eventHappen.SenderId.ToString());

        await notifications.SendCountersAsync(eventHappen.ReceiverId);
    }

    public async Task HandleAsync(GameInviteSentEvent eventHappen)
    {
        if (!Guid.TryParse(eventHappen.ReceiverId, out var receiverId)) return;

        await notifications.CreateNotificationAsync(
            receiverId,
            NotificationType.GameInvite,
            "Game Invite",
            $"{eventHappen.InviterName} invited you to play {eventHappen.GameType}",
            eventHappen.RoomId);
    }

    public async Task HandleAsync(GameInviteCancelledEvent eventHappen)
    {
        if (!Guid.TryParse(eventHappen.ReceiverId, out var receiverId)) return;

        await notifications.DeleteNotificationsByReferenceAsync(
            receiverId,
            NotificationType.GameInvite,
            eventHappen.RoomId);
    }

    public async Task HandleAsync(GameStartedEvent eventHappen)
    {
        await SetPresenceAsync(eventHappen.Player1Id, UserStatus.InGame);
        await SetPresenceAsync(eventHappen.Player2Id, UserStatus.InGame);
    }

    public async Task HandleAsync(GameFinishedEvent eventHappen)
    {
        await SetPresenceAsync(eventHappen.Player1Id, UserStatus.Online);
        await SetPresenceAsync(eventHappen.Player2Id, UserStatus.Online);

        if (Guid.TryParse(eventHappen.Player1Id, out var player1) && Guid.TryParse(eventHappen.Player2Id, out var player2)) await users.UpdateRanksAsync(player1, player2, eventHappen.Player1Score, eventHappen.Player2Score);
    }

    public async Task HandleAsync(GameLeftEvent eventHappen)
    {
        await SetPresenceAsync(eventHappen.PlayerId, UserStatus.Online);
    }

    public async Task HandleAsync(UserBlockedEvent eventHappen)
    {
        await hub.Clients.Group(UserGroup(eventHappen.BlockedUserId)).SendAsync("friend:blocked", new { userId = eventHappen.BlockerId });
        await RefreshBothSidesAsync(eventHappen.BlockerId, eventHappen.BlockedUserId);
    }

    public async Task HandleAsync(UserUnblockedEvent eventHappen)
    {
        await RefreshBothSidesAsync(eventHappen.BlockerId, eventHappen.BlockedUserId);
    }

    public async Task HandleAsync(FriendRequestCancelledEvent eventHappen)
    {
        await hub.Clients.Group(UserGroup(eventHappen.ReceiverId)).SendAsync("friend:requestCancelled", new { senderId = eventHappen.SenderId });

        await notifications.DeleteNotificationsByReferenceAsync(
            eventHappen.ReceiverId,
            NotificationType.FriendRequest,
            eventHappen.SenderId.ToString());

        await RefreshRequestsAsync(eventHappen.SenderId, eventHappen.ReceiverId);
    }

    private static string UserGroup(Guid userId) => $"user:{userId}";

    private static string Preview(string content) =>
        content.Length > Constants.MessagePreviewLength
            ? content[..Constants.MessagePreviewLength] + "..."
            : content;

    private async Task RefreshBothSidesAsync(Guid first, Guid second)
    {
        await notifications.SendSocialDataAsync(first);
        await notifications.SendSocialDataAsync(second);
    }

    private async Task RefreshFriendsAsync(Guid userId)
    {
        await notifications.SendCountersAsync(userId);
        await notifications.SendFriendsAsync(userId);
    }

    private async Task RefreshRequestsAsync(Guid first, Guid second)
    {
        await notifications.SendCountersAsync(first);
        await notifications.SendFriendRequestsAsync(first);
        await notifications.SendCountersAsync(second);
        await notifications.SendFriendRequestsAsync(second);
    }

    private async Task SetPresenceAsync(string rawUserId, UserStatus status)
    {
        if (!Guid.TryParse(rawUserId, out var userId) || userId == Guid.Empty) return;

        if (!presence.SetActivity(userId.ToString(), status)) return;

        var friendIds = await socialRead.GetFriendIdsAsync(userId);
        string eventName = status == UserStatus.InGame ? "friend:ingame" : "friend:online";
        foreach (var friendId in friendIds)
        {
            await hub.Clients.Group(UserGroup(friendId)).SendAsync(eventName, new { userId = userId.ToString() });
        }
    }
}
