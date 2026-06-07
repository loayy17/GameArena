using backend.Domain;
using backend.DTOs;

namespace backend.Auth
{
    public interface IAuthService
    {
        Task<AuthResponse?> LoginAsync(LoginRequest request);
        Task<User?> RegisterAsync(RegisterRequest request);
        Task<AuthResponse?> RefreshAccessTokenAsync(string rawRefreshToken);
    }
}
