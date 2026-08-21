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
        public string? Preferences { get; set; }
        public byte[]? Avatar { get; set; }
        public double? Rank { get; set; }
        public string? AvatarContentType { get; set; }

        public UserRole Role { get; set; } = UserRole.User;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsVerified { get; set; }
        public UserStatus Status { get; set; } = UserStatus.Offline;
        public ICollection<RefreshToken> RefreshTokens { get; set; } = [];
        public ICollection<Message> SentMessages { get; set; } = [];
        public ICollection<Message> ReceivedMessages { get; set; } = [];

        public ICollection<UserFriends> FriendshipsSent { get; set; } = [];
        public ICollection<UserFriends> FriendshipsReceived { get; set; } = [];

        public ICollection<FriendRequest> FriendRequestsSent { get; set; } = [];
        public ICollection<FriendRequest> FriendRequestsReceived { get; set; } = [];

        public ICollection<MatchHistory> MatchesAsPlayer1 { get; set; } = [];
        public ICollection<MatchHistory> MatchesAsPlayer2 { get; set; } = [];
    }
}