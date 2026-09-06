using backend.Enums;

namespace backend.DTOs.Responses
{
    public sealed record UserSummaryResponse(Guid Id, string UserName, string FirstName, string LastName, string FullName, UserStatus Status, string? AvatarUrl = null);
}
