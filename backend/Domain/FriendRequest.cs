using backend.Enums;

namespace backend.Domain
{
    public class FriendRequest
    {
        public Guid Id { get; set; }
        public Guid SenderId { get; set; }
        public User Sender { get; set; } = null!;
        public Guid ReceiverId { get; set; }
        public User Receiver { get; set; } = null!;
        public FriendRequestStatus Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
