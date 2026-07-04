using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

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
            user.Status = UserStatus.Online;
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


            var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (exists) throw new AppException(ErrorCode.EmailAlreadyExists);
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
            await _emailVerificationService.GenerateAndSendOtpAsync(user.Email, OtpPurpose.EmailVerification);
        }

        public async Task<AuthResponse> RefreshAccessTokenAsync(string rawRefreshToken)
        {
            var tokenHash = AuthHelper.Hash(rawRefreshToken);
            var storedToken = await _context.RefreshTokens.Include(t => t.User).FirstOrDefaultAsync(t => t.TokenHash == tokenHash) ?? throw new AppException(ErrorCode.RefreshTokenInvalid);

            if (storedToken.ExpiresAt <= DateTime.UtcNow) throw new AppException(ErrorCode.TokenExpired);
            if (storedToken.User == null) throw new AppException(ErrorCode.UserNotFound);

            if (!storedToken.User.IsVerified) throw new AppException(ErrorCode.EmailNotVerified);
            if (storedToken.User.Status != UserStatus.Online)
            {
                storedToken.User.Status = UserStatus.Online;
                await _context.SaveChangesAsync();
            }

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
            var storedToken = await _context.RefreshTokens
                .FirstOrDefaultAsync(t => t.TokenHash == AuthHelper.Hash(rawToken)) ?? throw new AppException(ErrorCode.RefreshTokenInvalid);
            var activeTokens = await _context.RefreshTokens
                .Where(t => t.UserId == storedToken.UserId && t.Id != storedToken.Id && t.ExpiresAt > DateTime.UtcNow)
                .CountAsync();

            if (activeTokens == 0 && storedToken.User != null) storedToken.User.Status = UserStatus.Offline;

            _context.RefreshTokens.Remove(storedToken);
            await _context.SaveChangesAsync();
        }
        public async Task ForgotPasswordAsync(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new AppException(ErrorCode.ValidationError);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email) ?? throw new AppException(ErrorCode.EmailNotFound);
            await _emailVerificationService.GenerateAndSendOtpAsync(email, OtpPurpose.PasswordReset);
        }

        public async Task ResetPasswordAsync(string email, string otp, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(otp) ||
                string.IsNullOrWhiteSpace(newPassword))
                throw new AppException(ErrorCode.ValidationError);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email) ?? throw new AppException(ErrorCode.EmailNotFound);
            var record = await _context.EmailVerfications
                .Where(x => x.UserId == user.Id && !x.IsUsed && x.Purpose == OtpPurpose.PasswordReset)
                .OrderByDescending(x => x.ExpiresAt)
                .FirstOrDefaultAsync() ?? throw new AppException(ErrorCode.OtpInvalid);

            if (string.IsNullOrWhiteSpace(newPassword)) throw new AppException(ErrorCode.ValidationError);
            if (record.ExpiresAt < DateTime.UtcNow) throw new AppException(ErrorCode.OtpExpired);
            if (record.OtpHash != AuthHelper.Hash(otp)) throw new AppException(ErrorCode.OtpInvalid);
            record.IsUsed = true;
            user.PasswordHash = AuthHelper.HashPassword(user, newPassword);
            await _context.SaveChangesAsync();
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