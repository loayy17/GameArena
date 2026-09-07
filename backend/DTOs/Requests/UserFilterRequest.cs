using backend.Enums;

namespace backend.DTOs.Requests
{
    public record UserFilterRequest(string? Name, UserStatus UserStatus = UserStatus.All, UserRole UserRole = UserRole.All);
}
