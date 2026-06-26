using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using System.Security.Claims;

namespace backend.Services
{
    public class CurrentUserService(IHttpContextAccessor accessor) : ICurrentUserService
    {
        public Guid UserId =>
            Guid.Parse(accessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? throw new AppException(ErrorCode.Unauthorized));
    }
}
