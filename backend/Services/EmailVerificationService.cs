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
        public async Task GenerateAndSendOtpAsync(string email, OtpPurpose purpose)
        {
            if (string.IsNullOrWhiteSpace(email)) throw new AppException(ErrorCode.ValidationError);

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email) ?? throw new AppException(ErrorCode.EmailNotFound);
            var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            var body = AuthHelper.GetHtmlTemplate(user.UserName, otp);


            _context.EmailVerfications.Add(new EmailVerfication
            {
                UserId = user.Id,
                OtpHash = AuthHelper.Hash(otp),
                ExpiresAt = DateTime.UtcNow.AddMinutes(15),
                IsUsed = false,
                Purpose = purpose
            });

            await _context.SaveChangesAsync();
            await _emailService.SendAsync(user.Email, "GameArena OTP Code", body);
        }

        public async Task VerifyOtpAsync(string email, string otp, OtpPurpose purpose)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(otp)) throw new AppException(ErrorCode.ValidationError);

            var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email) ?? throw new AppException(ErrorCode.EmailNotFound);

            var record = await _context.EmailVerfications
                .Where(x => x.UserId == user.Id && !x.IsUsed && x.Purpose == purpose)
                .OrderByDescending(x => x.ExpiresAt)
                .FirstOrDefaultAsync()
                ?? throw new AppException(ErrorCode.OtpInvalid);

            if (record.ExpiresAt < DateTime.UtcNow) throw new AppException(ErrorCode.OtpExpired);
            if (record.OtpHash != AuthHelper.Hash(otp)) throw new AppException(ErrorCode.OtpInvalid);
            if (purpose == OtpPurpose.EmailVerification && user.IsVerified) throw new AppException(ErrorCode.EmailAlreadyVerified);
            if (purpose == OtpPurpose.EmailVerification) user.IsVerified = true;

            record.IsUsed = true;
            await _context.SaveChangesAsync();
        }
    }
}