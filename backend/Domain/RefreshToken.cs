using System.ComponentModel.DataAnnotations;

namespace backend.Domain
{
    public class RefreshToken
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public string TokenHash { get; set; } = string.Empty;

        [Required]
        public DateTime ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Required]
        public Guid UserId { get; set; }

        public User User { get; set; } = null!;
    }
}
