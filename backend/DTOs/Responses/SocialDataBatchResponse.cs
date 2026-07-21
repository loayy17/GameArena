using backend.DTOs.Requests;

namespace backend.DTOs.Responses
{

    public class SocialDataBatchResponse
    {
        public List<UserSummaryResponse> Friends { get; set; } = new();
        public List<FriendRequestReceivedResponse> ReceivedRequests { get; set; } = new();
        public List<FriendRequestSentResponse> SentRequests { get; set; } = new();
        public List<UserSummaryResponse> BlockedUsers { get; set; } = new();
        public NotificationCountersResponse Counters { get; set; } = new();
    }
}
