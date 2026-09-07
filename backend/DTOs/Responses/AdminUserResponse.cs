using backend.Enums;

namespace backend.DTOs.Responses
{
    public sealed record AdminUserResponse(Guid Id, string UserName, string FirstName, string LastName, string FullName, string Email, UserRole Role, bool IsBanned, UserStatus Status, string? AvatarUrl = null);
}