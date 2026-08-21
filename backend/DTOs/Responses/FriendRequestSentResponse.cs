namespace backend.DTOs.Responses
{
    public sealed record FriendRequestSentResponse
    {
        public Guid ReceiverId { get; init; }
        public string ReceiverUserName { get; init; } = string.Empty;
        public string ReceiverFirstName { get; init; } = string.Empty;
        public string ReceiverLastName { get; init; } = string.Empty;
        public string? ReceiverAvatarUrl { get; init; }
        public DateTime SentAt { get; init; }
    }
}