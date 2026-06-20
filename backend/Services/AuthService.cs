using backend.Data;
using backend.Domain;
using backend.DTOs;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using Microsoft.EntityFrameworkCore;

namespace backend.Auth
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailVerificationService _emailVerificationService;

        public AuthService(
            AppDbContext context,
            IConfiguration configuration,
            IEmailVerificationService emailVerificationService
        )
        {
            _context = context;
            _configuration = configuration;
            _emailVerificationService = emailVerificationService;
        }
        public async Task<AuthResponse?> LoginAsync(LoginRequest request)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null)
                throw new Exception("INVALID_CREDENTIALS");

            if (!user.IsVerified)
                throw new Exception("EMAIL_NOT_VERIFIED");

            var validPassword = AuthHelper.VerifyPassword(
                user,
                user.PasswordHash,
                request.Password
            );

            if (!validPassword)
                throw new Exception("INVALID_CREDENTIALS");

            var accessToken = AuthHelper.CreateToken(user, _configuration);
            var refreshToken = AuthHelper.GenerateRefreshTokenString();

            await SaveNewRefreshToken(user.Id, refreshToken);

            return new AuthResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        public async Task RegisterAsync(RegisterRequest request)
        {
            var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);

            if (exists)
                throw new Exception("EMAIL_ALREADY_EXISTS");

            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHash = AuthHelper.HashPassword(new User(), request.Password),
                Role = UserRole.User,
                IsVerified = false
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await _emailVerificationService.GenerateAndSendOtpAsync(
                user.Email,
                OtpPurpose.EmailVerification
            );
        }

        public async Task<AuthResponse?> RefreshAccessTokenAsync(string rawRefreshToken)
        {
            var tokenHash = AuthHelper.ComputeHash(rawRefreshToken);

            var storedToken = await _context.RefreshTokens
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

            if (storedToken == null || storedToken.ExpiresAt <= DateTime.UtcNow)
                throw new Exception("INVALID_REFRESH_TOKEN");

            _context.RefreshTokens.Remove(storedToken);

            var newAccessToken = AuthHelper.CreateToken(storedToken.User, _configuration);
            var newRefreshToken = AuthHelper.GenerateRefreshTokenString();

            await SaveNewRefreshToken(storedToken.User.Id, newRefreshToken);

            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task RevokeRefreshTokenAsync(string rawToken)
        {
            var tokenHash = AuthHelper.ComputeHash(rawToken);

            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash);

            if (storedToken != null)
            {
                _context.RefreshTokens.Remove(storedToken);
                await _context.SaveChangesAsync();
            }
        }
        public async Task ForgotPassword(string email)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return;

            await _emailVerificationService.GenerateAndSendOtpAsync(
                email,
                OtpPurpose.PasswordReset
            );
        }
        public async Task ResetPasswordAsync(string email, string otp, string newPassword)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email) ?? throw new Exception("INVALID_REQUEST");
            var record = await _context.EmailVerfications
                .Where(x =>
                    x.UserId == user.Id &&
                    !x.IsUsed &&
                    x.Purpose == OtpPurpose.PasswordReset)
                .OrderByDescending(x => x.ExpiresAt)
                .FirstOrDefaultAsync() ?? throw new Exception("OTP_INVALID");

            if (record.ExpiresAt < DateTime.UtcNow)
                throw new Exception("OTP_EXPIRED");

            if (record.OtpHash != Convert.ToBase64String(
                System.Security.Cryptography.SHA256.HashData(
                    System.Text.Encoding.UTF8.GetBytes(otp)
                )))
                throw new Exception("OTP_INVALID");

            record.IsUsed = true;
            user.PasswordHash = AuthHelper.HashPassword(user, newPassword);
            await _context.SaveChangesAsync();
        }
        private async Task SaveNewRefreshToken(Guid userId, string rawRefreshToken)
        {
            var tokenHash = AuthHelper.ComputeHash(rawRefreshToken);

            _context.RefreshTokens.Add(new RefreshToken
            {
                UserId = userId,
                TokenHash = tokenHash,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });

            await _context.SaveChangesAsync();
        }
    }
}