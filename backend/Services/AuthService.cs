using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Services
{
    public class AuthService(AppDbContext _context, IConfiguration _configuration, IEmailVerificationService _emailVerificationService) : IAuthService
    {
        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                throw new AppException(ErrorCode.ValidationError);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email) ?? throw new AppException(ErrorCode.InvalidCredentials);

            if (!user.IsVerified)
                throw new AppException(ErrorCode.EmailNotVerified);

            var validPassword = AuthHelper.VerifyPassword(user, user.PasswordHash, request.Password);
            if (!validPassword) throw new AppException(ErrorCode.InvalidCredentials);

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
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName) ||
                string.IsNullOrWhiteSpace(request.UserName) ||
                string.IsNullOrWhiteSpace(request.LastName))
                throw new AppException(ErrorCode.ValidationError);

            var user = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                Role = UserRole.User,
                IsVerified = false
            };
            user.PasswordHash = AuthHelper.HashPassword(user, request.Password);

            _context.Users.Add(user);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg)
            {
                if (pg.ConstraintName?.Contains("Email") == true)
                    throw new AppException(ErrorCode.EmailAlreadyExists);
                if (pg.ConstraintName?.Contains("UserName") == true)
                    throw new AppException(ErrorCode.UsernameAlreadyExists);
                throw;
            }
            await _emailVerificationService.GenerateAndSendOtpAsync(user.Email, OtpPurpose.EmailVerification);
        }

        public async Task<AuthResponse> RefreshAccessTokenAsync(string rawRefreshToken)
        {
            var tokenHash = AuthHelper.Hash(rawRefreshToken);
            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash) ?? throw new AppException(ErrorCode.RefreshTokenInvalid);

            if (storedToken.ExpiresAt <= DateTime.UtcNow) throw new AppException(ErrorCode.TokenExpired);

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == storedToken.UserId)
                ?? throw new AppException(ErrorCode.UserNotFound);

            if (!user.IsVerified) throw new AppException(ErrorCode.EmailNotVerified);
            _context.RefreshTokens.Remove(storedToken);
            var newAccessToken = AuthHelper.CreateToken(user, _configuration);
            var newRefreshToken = AuthHelper.GenerateRefreshTokenString();
            await SaveNewRefreshToken(user.Id, newRefreshToken);
            return new AuthResponse
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };
        }

        public async Task RevokeRefreshTokenAsync(string rawToken)
        {
            var tokenHash = AuthHelper.Hash(rawToken);
            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == tokenHash) ?? throw new AppException(ErrorCode.RefreshTokenInvalid);

            _context.RefreshTokens.Remove(storedToken);
            await _context.SaveChangesAsync();
        }
        public async Task ForgotPasswordAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new AppException(ErrorCode.ValidationError);

            if (!await _context.Users.AnyAsync(u => u.Email == email))
                throw new AppException(ErrorCode.EmailNotFound);

            await _emailVerificationService.GenerateAndSendOtpAsync(email, OtpPurpose.PasswordReset);
        }

        public async Task ResetPasswordAsync(string email, string otp, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword))
                throw new AppException(ErrorCode.ValidationError);

            await _emailVerificationService.VerifyOtpAsync(email, otp, OtpPurpose.PasswordReset);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email) ?? throw new AppException(ErrorCode.EmailNotFound);

            user.PasswordHash = AuthHelper.HashPassword(user, newPassword);
            await RevokeAllRefreshTokensAsync(user.Id);
            await _context.SaveChangesAsync();
        }

        private async Task RevokeAllRefreshTokensAsync(Guid userId)
        {
            await _context.RefreshTokens
                .Where(t => t.UserId == userId)
                .ExecuteDeleteAsync();
        }
        private async Task SaveNewRefreshToken(Guid userId, string rawRefreshToken)
        {
            var tokenHash = AuthHelper.Hash(rawRefreshToken);

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
