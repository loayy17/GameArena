namespace backend.DTOs.Responses;

public sealed record NotificationCountersResponse
{
    public int ReceivedFriendRequests { get; init; }
    public int SentFriendRequests { get; init; }
    public int UnreadMessages { get; init; }
    public int Friends { get; init; }
}
