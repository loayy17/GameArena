namespace backend.DTOs.Responses;

public sealed record PerFriendUnreadCountResponse(Guid FriendId, int UnreadCount);
