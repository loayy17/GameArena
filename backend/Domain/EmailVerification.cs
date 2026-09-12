using backend.Enums;

namespace backend.Domain
{
    public class EmailVerification
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string OtpHash { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; }
        public int FailedAttempts { get; set; }
        public OtpPurpose Purpose { get; set; }
    }
}
