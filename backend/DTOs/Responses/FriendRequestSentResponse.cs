namespace backend.DTOs.Responses
{
    public class FriendRequestSentResponse
    {
        public Guid ReceiverId { get; set; }
        public string ReceiverUserName { get; set; } = string.Empty;
        public string ReceiverFirstName { get; set; } = string.Empty;
        public string ReceiverLastName { get; set; } = string.Empty;
        public DateTime SentAt { get; set; }
    }
}
