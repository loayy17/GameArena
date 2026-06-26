namespace backend.DTOs.Responses
{
    public class ChatNotificationResponse
    {
        public string Type { get; set; } = "";
        public Guid? SenderId { get; set; }
        public string? SenderUsername { get; set; }
        public string Message { get; set; } = "";
        public DateTime CreatedAt { get; set; }
    }
}
