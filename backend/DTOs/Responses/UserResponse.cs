using backend.Enums;

namespace backend.DTOs.Responses
{
    public sealed record UserResponse
    {
        public Guid Id { get; init; }
        public string UserName { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public string FirstName { get; init; } = string.Empty;
        public string LastName { get; init; } = string.Empty;
        public UserRole Role { get; init; }
        public UserStatus Status { get; init; }
        public DateTime CreatedAt { get; init; }
        public bool IsVerified { get; init; }
        public string? Preferences { get; init; }
        public string? AvatarUrl { get; init; }
    }
}