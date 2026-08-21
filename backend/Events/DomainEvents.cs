using backend.Enums;

namespace backend.Events;

public sealed record FriendRequestSentEvent(
    Guid SenderId,
    Guid ReceiverId,
    string SenderName
) : DomainEvent;

public sealed record FriendRequestAcceptedEvent(
    Guid SenderId,
    Guid AccepterId,
    string AccepterName
) : DomainEvent;

public sealed record FriendRequestDeclinedEvent(
    Guid SenderId,
    Guid DeclinerId
) : DomainEvent;

public sealed record FriendRemovedEvent(
    Guid RemoverId,
    Guid RemovedFriendId
) : DomainEvent;

public sealed record UserBlockedEvent(
    Guid BlockerId,
    Guid BlockedUserId
) : DomainEvent;

public sealed record FriendRequestCancelledEvent(
    Guid SenderId,
    Guid ReceiverId
) : DomainEvent;

public sealed record UserUnblockedEvent(
    Guid BlockerId,
    Guid BlockedUserId
) : DomainEvent;

public sealed record ChatMessageSentEvent(
    Guid SenderId,
    Guid ReceiverId,
    string Content,
    DateTime SentAt
) : DomainEvent;

public sealed record GameStartedEvent(
    string Player1Id,
    string Player2Id
) : DomainEvent;

public sealed record GameFinishedEvent(
    string Player1Id,
    string Player2Id,
    int Player1Score,
    int Player2Score
) : DomainEvent;

public sealed record GameLeftEvent(
    string PlayerId
) : DomainEvent;

public sealed record GameInviteSentEvent(
    string ReceiverId,
    string RoomId,
    string InviterId,
    string InviterName,
    GamesKind GameType
) : DomainEvent;
