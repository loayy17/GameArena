using backend.Enums;
using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;


        public UserRole Role { get; set; } = UserRole.User;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsVerified { get; set; } = false;
        public UserStatus Status { get; set; } = UserStatus.Offline;
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
        
        public ICollection<Message> SentMessages { get; set; } = new List<Message>();
        public ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
        

        // friends already added 
        public ICollection<UserFriends> FriendshipsSent  { get; set; } = new List<UserFriends>();
        public ICollection<UserFriends> FriendshipsReceived { get; set; } = new List<UserFriends>();

        // friend requests sent and received
        public ICollection<FriendRequest> FriendRequestsSent { get; set; }= new List<FriendRequest>();
        public ICollection<FriendRequest> FriendRequestsReceived { get; set; } = new List<FriendRequest>();
    }
}
