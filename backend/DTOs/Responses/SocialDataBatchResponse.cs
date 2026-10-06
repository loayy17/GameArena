namespace backend.DTOs.Responses;

public sealed record SocialDataBatchResponse
{
    public List<UserSummaryResponse> Friends { get; init; } = [];
    public List<FriendRequestReceivedResponse> ReceivedRequests { get; init; } = [];
    public List<FriendRequestSentResponse> SentRequests { get; init; } = [];
    public List<UserSummaryResponse> BlockedUsers { get; init; } = [];
    public NotificationCountersResponse Counters { get; init; } = new();
}
