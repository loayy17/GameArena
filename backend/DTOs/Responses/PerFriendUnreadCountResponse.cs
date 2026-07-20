namespace backend.DTOs.Responses
{
    public class PerFriendUnreadCountResponse
    {
        public Guid FriendId { get; set; }
        public int UnreadCount { get; set; }
    }
}
