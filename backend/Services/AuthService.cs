using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;

namespace backend.Services;

public class AuthService(
    AppDbContext context,
    ITokenService tokens,
    IPasswordHasher<User> passwordHasher,
    IEmailVerificationService emailVerification) : IAuthService
{
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password)) throw new AppException(ErrorCode.ValidationError);

        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == request.Email)
            ?? throw new AppException(ErrorCode.InvalidCredentials);

        EnsureCanSignIn(user);

        if (passwordHasher.VerifyHashedPassword(user, user.PasswordHash, request.Password) != PasswordVerificationResult.Success) throw new AppException(ErrorCode.InvalidCredentials);

        return await IssueAsync(user);
    }

    public async Task<AuthResponse> LoginByVerifiedEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new AppException(ErrorCode.ValidationError);

        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Email == email)
            ?? throw new AppException(ErrorCode.InvalidCredentials);

        EnsureCanSignIn(user);
        return await IssueAsync(user);
    }

    public async Task RegisterAsync(RegisterRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email)
            || string.IsNullOrWhiteSpace(request.Password)
            || string.IsNullOrWhiteSpace(request.FirstName)
            || string.IsNullOrWhiteSpace(request.UserName)
            || string.IsNullOrWhiteSpace(request.LastName))
        {
            throw new AppException(ErrorCode.ValidationError);
        }

        var user = new User
        {
            UserName = request.UserName,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = UserRole.User,
            IsVerified = false,
            Rank = 0
        };

        user.PasswordHash = passwordHasher.HashPassword(user, request.Password);
        context.Users.Add(user);

        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pg)
        {
            if (pg.ConstraintName?.Contains("Email") == true) throw new AppException(ErrorCode.EmailAlreadyExists);
            if (pg.ConstraintName?.Contains("UserName") == true) throw new AppException(ErrorCode.UsernameAlreadyExists);
            throw;
        }
        await emailVerification.GenerateAndSendOtpAsync(user.Email, OtpPurpose.EmailVerification);
    }

    public async Task<AuthResponse> RefreshAccessTokenAsync(string rawRefreshToken)
    {
        var stored = await FindRefreshTokenAsync(rawRefreshToken);

        if (stored.ExpiresAt <= DateTime.UtcNow) throw new AppException(ErrorCode.TokenExpired);

        var user = await context.Users.FirstOrDefaultAsync(u => u.Id == stored.UserId)
            ?? throw new AppException(ErrorCode.UserNotFound);

        EnsureCanSignIn(user);
        context.RefreshTokens.Remove(stored);
        return await IssueAsync(user);
    }

    public async Task RevokeRefreshTokenAsync(string rawToken)
    {
        context.RefreshTokens.Remove(await FindRefreshTokenAsync(rawToken));
        await context.SaveChangesAsync();
    }

    public async Task ForgotPasswordAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) throw new AppException(ErrorCode.ValidationError);

        if (!await context.Users.AnyAsync(u => u.Email == email)) return;

        await emailVerification.GenerateAndSendOtpAsync(email, OtpPurpose.PasswordReset);
    }

    public async Task ResetPasswordAsync(string email, string otp, string newPassword)
    {
        if (string.IsNullOrWhiteSpace(newPassword)) throw new AppException(ErrorCode.ValidationError);

        await emailVerification.VerifyOtpAsync(email, otp, OtpPurpose.PasswordReset);

        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email)
            ?? throw new AppException(ErrorCode.EmailNotFound);

        user.PasswordHash = passwordHasher.HashPassword(user, newPassword);

        await context.RefreshTokens.Where(t => t.UserId == user.Id).ExecuteDeleteAsync();
        await context.SaveChangesAsync();
    }

    private static void EnsureCanSignIn(User user)
    {
        if (user.IsBanned) throw new AppException(ErrorCode.UserBanned);
        if (!user.IsVerified) throw new AppException(ErrorCode.EmailNotVerified);
    }

    private async Task<RefreshToken> FindRefreshTokenAsync(string rawToken)
    {
        var hash = tokens.Hash(rawToken);

        return await context.RefreshTokens.FirstOrDefaultAsync(t => t.TokenHash == hash)
            ?? throw new AppException(ErrorCode.RefreshTokenInvalid);
    }

    private async Task<AuthResponse> IssueAsync(User user)
    {
        var refreshToken = tokens.CreateRefreshToken();

        context.RefreshTokens.Add(new RefreshToken
        {
            UserId = user.Id,
            TokenHash = tokens.Hash(refreshToken),
            ExpiresAt = DateTime.UtcNow.AddDays(Constants.RefreshTokenDays)
        });

        await context.SaveChangesAsync();

        return new AuthResponse
        {
            AccessToken = tokens.CreateAccessToken(user),
            RefreshToken = refreshToken
        };
    }
}
