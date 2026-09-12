using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace backend.Services
{
    public class EmailVerificationService(AppDbContext _context, IEmailService _emailService) : IEmailVerificationService
    {
        private static readonly TimeSpan OtpCooldown = TimeSpan.FromSeconds(60);

        public async Task GenerateAndSendOtpAsync(string email, OtpPurpose purpose)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new AppException(ErrorCode.ValidationError);

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email)
                ?? throw new AppException(ErrorCode.EmailNotFound);

            await _context.EmailVerifications
                .Where(x => x.UserId == user.Id && (x.IsUsed || x.ExpiresAt < DateTime.UtcNow))
                .ExecuteDeleteAsync();

            var recent = await _context.EmailVerifications
                .Where(x => x.UserId == user.Id && x.Purpose == purpose && !x.IsUsed)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync();
            if (recent != null && recent.CreatedAt > DateTime.UtcNow - OtpCooldown)
                throw new AppException(ErrorCode.RateLimited);

            var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            var body = AuthHelper.GetHtmlTemplate(user.UserName, otp);

            var verification = new EmailVerification
            {
                UserId = user.Id,
                OtpHash = AuthHelper.Hash(otp),
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false,
                FailedAttempts = 0,
                Purpose = purpose
            };
            _context.EmailVerifications.Add(verification);

            await _context.SaveChangesAsync();
            try
            {
                await _emailService.SendAsync(user.Email, "Arena 404 OTP Code", body);
            }
            catch
            {
                _context.EmailVerifications.Remove(verification);
                await _context.SaveChangesAsync();
                throw;
            }
        }

        public async Task VerifyOtpAsync(string email, string otp, OtpPurpose purpose)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(otp))
                throw new AppException(ErrorCode.ValidationError);

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email)
                ?? throw new AppException(ErrorCode.EmailNotFound);

            var record = await _context.EmailVerifications
                .Where(x => x.UserId == user.Id && !x.IsUsed && x.Purpose == purpose)
                .OrderByDescending(x => x.CreatedAt)
                .FirstOrDefaultAsync()
                ?? throw new AppException(ErrorCode.OtpInvalid);

            if (record.ExpiresAt < DateTime.UtcNow)
                throw new AppException(ErrorCode.OtpExpired);

            if (record.OtpHash != AuthHelper.Hash(otp))
            {
                record.FailedAttempts++;
                if (record.FailedAttempts >= 5)
                    record.IsUsed = true;
                await _context.SaveChangesAsync();
                throw new AppException(record.IsUsed ? ErrorCode.RateLimited : ErrorCode.OtpInvalid);
            }
            if (purpose == OtpPurpose.EmailVerification && user.IsVerified)
                throw new AppException(ErrorCode.EmailAlreadyVerified);

            if (purpose == OtpPurpose.EmailVerification)
                user.IsVerified = true;

            record.IsUsed = true;
            await _context.SaveChangesAsync();
        }
    }
}
