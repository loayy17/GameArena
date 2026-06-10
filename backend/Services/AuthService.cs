using backend.Data;
using backend.Domain;
using backend.DTOs;
using backend.Enums;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user is null)
                return null;

            bool passwordCheck = AuthHelper.VerifyPassword(user, user.PasswordHash, request.Password);
            if (!passwordCheck)
                return null;

            var accessToken = AuthHelper.CreateToken(user, _configuration);
            var rawRefreshToken = AuthHelper.GenerateRefreshTokenString();
            await SaveNewRefreshToken(user.Id, rawRefreshToken);

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = rawRefreshToken
            };
        }

        public async Task<User?> RegisterAsync(RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return null;

            var user = new User();
            var passwordHash = AuthHelper.HashPassword(user, request.Password);
            user = new User
            {
                UserName = request.UserName,
                PasswordHash = passwordHash,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Role = UserRole.User
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<AuthResponse?> RefreshAccessTokenAsync(string rawRefreshToken)
        {
            string tokenHash = AuthHelper.ComputeHash(rawRefreshToken);
            var storedToken = await _context.RefreshTokens
                .Include(rt => rt.User)
                .FirstOrDefaultAsync(rt => rt.TokenHash == tokenHash);

            if (storedToken is null || storedToken.ExpiresAt <= DateTime.UtcNow)
                return null;

            _context.RefreshTokens.Remove(storedToken);
            
            var newAccessToken = AuthHelper.CreateToken(storedToken.User, _configuration);
            var newRawRefreshToken = AuthHelper.GenerateRefreshTokenString();
            await SaveNewRefreshToken(storedToken.User.Id, newRawRefreshToken);

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRawRefreshToken
            };
        }

        private async Task SaveNewRefreshToken(Guid userId, string rawRefreshToken)
        {
            string tokenHash = AuthHelper.ComputeHash(rawRefreshToken);
            var newSession = new RefreshToken
            {
                UserId = userId,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };
            _context.RefreshTokens.Add(newSession);
            await _context.SaveChangesAsync();
        }
    }
}
