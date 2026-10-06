using System.Security.Cryptography;
using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class EmailVerificationService(AppDbContext context, IEmailService emailService, ITokenService tokens) : IEmailVerificationService
{
    public async Task GenerateAndSendOtpAsync(string email, OtpPurpose purpose)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new AppException(ErrorCode.ValidationError);

        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email)
            ?? throw new AppException(ErrorCode.EmailNotFound);

        await context.EmailVerifications
            .Where(x => x.UserId == user.Id && x.Purpose == purpose && (x.IsUsed || x.ExpiresAt < DateTime.UtcNow))
            .ExecuteDeleteAsync();

        var mostRecent = await context.EmailVerifications
            .Where(x => x.UserId == user.Id && x.Purpose == purpose && !x.IsUsed)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync();

        if (mostRecent != null && mostRecent.CreatedAt > DateTime.UtcNow - TimeSpan.FromSeconds(Constants.OtpResendCooldownSeconds)) throw new AppException(ErrorCode.RateLimited);

        var otp = RandomNumberGenerator.GetInt32(100000, 999999).ToString();

        var verification = new EmailVerification
        {
            UserId = user.Id,
            OtpHash = tokens.Hash(otp),
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.Add(TimeSpan.FromMinutes(Constants.OtpLifetimeMinutes)),
            IsUsed = false,
            FailedAttempts = 0,
            Purpose = purpose
        };

        context.EmailVerifications.Add(verification);
        await context.SaveChangesAsync();

        try
        {
            await emailService.SendAsync(user.Email, "Arena 404 OTP Code", OtpEmailTemplate.Render(user.UserName, otp));
        }
        catch
        {
            context.EmailVerifications.Remove(verification);
            await context.SaveChangesAsync();
            throw;
        }
    }

    public async Task VerifyOtpAsync(string email, string otp, OtpPurpose purpose)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(otp)) throw new AppException(ErrorCode.ValidationError);

        var user = await context.Users.FirstOrDefaultAsync(x => x.Email == email)
            ?? throw new AppException(ErrorCode.EmailNotFound);

        var record = await context.EmailVerifications
            .Where(x => x.UserId == user.Id && !x.IsUsed && x.Purpose == purpose)
            .OrderByDescending(x => x.CreatedAt)
            .FirstOrDefaultAsync()
            ?? throw new AppException(ErrorCode.OtpInvalid);

        if (record.ExpiresAt < DateTime.UtcNow) throw new AppException(ErrorCode.OtpExpired);

        if (record.OtpHash != tokens.Hash(otp))
        {
            record.FailedAttempts++;
            if (record.FailedAttempts >= Constants.MaxAttempts) record.IsUsed = true;

            await context.SaveChangesAsync();
            throw new AppException(record.IsUsed ? ErrorCode.RateLimited : ErrorCode.OtpInvalid);
        }

        if (purpose == OtpPurpose.EmailVerification)
        {
            if (user.IsVerified) throw new AppException(ErrorCode.EmailAlreadyVerified);

            user.IsVerified = true;
        }

        record.IsUsed = true;
        await context.SaveChangesAsync();
    }
}
