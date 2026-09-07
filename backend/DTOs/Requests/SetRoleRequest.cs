using backend.Enums;

namespace backend.DTOs.Requests
{
    public sealed record SetRoleRequest(Guid Id, UserRole Role);
}
