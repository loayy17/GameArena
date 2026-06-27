namespace backend.DTOs.Responses
{
    public class FriendRequestReceivedResponse
    {
        public Guid SenderId { get; set; }
        public string SenderUserName { get; set; } = string.Empty;
        public string SenderFirstName { get; set; } = string.Empty;
        public string SenderLastName { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
