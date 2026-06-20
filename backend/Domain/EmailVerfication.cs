using backend.Enums;

namespace backend.Domain
{
    public class EmailVerfication
    {
            public Guid Id { get; set; }
            public Guid UserId { get; set; }
            public string OtpHash { get; set; } = string.Empty;
            public DateTime ExpiresAt { get; set; }
            public bool IsUsed { get; set; }
            public OtpPurpose Purpose { get; set; }
    }
}
