using backend.Data;
using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace backend.Services;

public class UserService(
    AppDbContext context,
    IUserPresenceService presence,
    IEmailVerificationService emailVerification,
    IPasswordHasher<User> passwordHasher,
    IMemoryCache avatarCache) : IUserService
{
    private static readonly TimeSpan AvatarCacheTtl = TimeSpan.FromMinutes(30);

    public async Task<UserResponse> GetUserByIdAsync(Guid userId)
    {
        var user = await context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == userId)
            ?? throw new AppException(ErrorCode.UserNotFound);

        return user.ToUserResponse(presence.GetStatus(userId.ToString()));
    }

    public async Task<UserPublicProfileResponse> GetUserProfileAsync(Guid userId, Guid viewerId)
    {
        bool canViewStats = viewerId == userId || await context.UserFriends.AnyAsync(f =>
            (f.UserId == viewerId && f.FriendId == userId) ||
            (f.UserId == userId && f.FriendId == viewerId));

        var profile = await context.Users
            .AsNoTracking()
            .Where(u => u.Id == userId)
            .Select(u => new UserPublicProfileResponse
            {
                Id = u.Id,
                UserName = u.UserName,
                FirstName = u.FirstName,
                LastName = u.LastName,
                FullName = u.FirstName + " " + u.LastName,
                AvatarUrl = MappingExtensions.AvatarUrl(u.Id, u.Avatar),
                CreatedAt = u.CreatedAt,
                Rank = u.Rank,
                Status = UserStatus.Offline
            })
            .FirstOrDefaultAsync()
            ?? throw new AppException(ErrorCode.UserNotFound);

        profile = profile with { Status = presence.GetStatus(userId.ToString()) };

        if (!canViewStats) return profile;

        var stats = await GetMatchStatsAsync(userId);

        return profile with
        {
            TotalMatches = stats.Total,
            Wins = stats.Wins,
            Losses = stats.Losses,
            Draws = stats.Draws,
            WinRate = stats.Total == 0 ? 0 : Math.Round(stats.Wins * 100.0 / stats.Total, 1),
            RecentMatches = await GetRecentMatchesAsync(userId, Constants.RecentMatchCount)
        };
    }

    public async Task<List<UserSummaryResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter)
    {
        if (!UserSearchQuery.HasText(filter?.Name)) return [];

        var query = context.Users
            .AsNoTracking()
            .Where(u => u.Id != currentUserId && !u.IsBanned)
            .Where(u => !context.Blocks.Any(b =>
                (b.BlockerId == currentUserId && b.BlockedId == u.Id) ||
                (b.BlockedId == currentUserId && b.BlockerId == u.Id)));

        query = UserSearchQuery.Apply(query, filter!.Name);

        if (filter.UserRole != UserRole.All) query = query.Where(u => u.Role == filter.UserRole);

        var users = await query.Select(MappingExtensions.ToSummaryProjection).ToListAsync();

        return ApplyPresenceAndStatus(users, filter.UserStatus);
    }

    public async Task<List<AdminUserResponse>> GetUsersByAdminAsync(UserFilterRequest? filter)
    {
        var query = UserSearchQuery.Apply(context.Users.AsNoTracking().AsQueryable(), filter?.Name);
        var role = filter?.UserRole ?? UserRole.All;

        if (role != UserRole.All) query = query.Where(u => u.Role == role);

        var users = await query
            .OrderBy(u => u.UserName)
            .Select(MappingExtensions.ToAdminUser)
            .ToListAsync();

        var status = filter?.UserStatus ?? UserStatus.All;
        var results = users.Select(u => u with { Status = presence.GetStatus(u.Id.ToString()) });

        return status == UserStatus.All ? [.. results] : [.. results.Where(u => u.Status == status)];
    }

    public async Task<List<UserSummaryResponse>> GetLeaderboardAsync(int limit)
    {
        var rows = await context.Users
            .AsNoTracking()
            .Where(u => !u.IsBanned)
            .OrderByDescending(u => u.Rank)
            .ThenBy(u => u.UserName)
            .Take(limit)
            .Select(MappingExtensions.ToSummaryProjection)
            .ToListAsync();

        return ApplyPresenceAndStatus(rows, UserStatus.All);
    }

    public async Task<AdminStatsResponse> GetStatsAsync()
    {
        var total = await context.Users.AsNoTracking().CountAsync();
        var banned = await context.Users.AsNoTracking().CountAsync(u => u.IsBanned);
        var (online, inGame) = presence.GetOnlineCounts();

        return new AdminStatsResponse
        {
            TotalUsers = total,
            BannedUsers = banned,
            OnlineUsers = online,
            InGameUsers = inGame,
            OfflineUsers = Math.Max(0, total - online - inGame - banned)
        };
    }

    public async Task<string?> GetPreferencesAsync(Guid userId)
    {
        var row = await context.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.Preferences })
            .FirstOrDefaultAsync()
            ?? throw new AppException(ErrorCode.UserNotFound);

        return row.Preferences;
    }

    public async Task<(byte[] Bytes, string ContentType)?> GetAvatarAsync(Guid userId)
    {
        if (avatarCache.TryGetValue(CacheKey(userId), out (byte[] Bytes, string ContentType) cached)) return cached;

        var avatar = await context.Users
            .Where(u => u.Id == userId)
            .Select(u => new { u.Avatar, u.AvatarContentType })
            .FirstOrDefaultAsync();

        if (avatar?.Avatar == null || string.IsNullOrEmpty(avatar.AvatarContentType)) return null;

        var result = (avatar.Avatar, avatar.AvatarContentType);
        avatarCache.Set(CacheKey(userId), result, AvatarCacheTtl);
        return result;
    }

    public async Task<UserResponse> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
    {
        var user = await GetTrackedUserAsync(userId);
        bool emailChanged = !string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase);

        if (UsernameChanged(user, request.UserName)
            && await context.Users.AnyAsync(u => u.Id != userId && u.UserName == request.UserName))
        {
            throw new AppException(ErrorCode.UsernameAlreadyExists);
        }

        if (emailChanged && await context.Users.AnyAsync(u => u.Id != userId && u.Email == request.Email)) throw new AppException(ErrorCode.EmailAlreadyExists);

        user.UserName = request.UserName;
        user.FirstName = request.FirstName;
        user.LastName = request.LastName;

        if (emailChanged)
        {
            user.Email = request.Email;
            user.IsVerified = false;
        }

        await context.SaveChangesAsync();

        if (emailChanged) await emailVerification.GenerateAndSendOtpAsync(request.Email, OtpPurpose.EmailVerification);

        return user.ToUserResponse(presence.GetStatus(userId.ToString()));
    }

    public async Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
    {
        await TransactionHelper.ExecuteAsync(context, async () =>
        {
            var user = await GetTrackedUserAsync(userId);

            if (passwordHasher.VerifyHashedPassword(user, user.PasswordHash, oldPassword) != PasswordVerificationResult.Success) throw new AppException(ErrorCode.InvalidCredentials);

            user.PasswordHash = passwordHasher.HashPassword(user, newPassword);
            await context.SaveChangesAsync();

            await context.RefreshTokens.Where(t => t.UserId == userId).ExecuteDeleteAsync();
        });
    }

    public async Task UpdatePreferencesAsync(Guid userId, string preferencesJson)
    {
        var updated = await context.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.Preferences, preferencesJson));

        if (updated == 0) throw new AppException(ErrorCode.UserNotFound);
    }

    public async Task<UserResponse> UpdateAvatarAsync(Guid userId, IFormFile file)
    {
        if (file.Length <= 0
            || file.Length > Constants.AvatarMaxBytes
            || !Constants.AllowedAvatarTypes.Contains(file.ContentType))
            throw new AppException(ErrorCode.InvalidAvatar);

        var user = await GetTrackedUserAsync(userId);

        await using var buffer = new MemoryStream();
        await file.CopyToAsync(buffer);

        user.Avatar = buffer.ToArray();
        user.AvatarContentType = file.ContentType;
        await context.SaveChangesAsync();

        avatarCache.Remove(CacheKey(userId));
        return user.ToUserResponse(presence.GetStatus(userId.ToString()));
    }

    public async Task<UserResponse> RemoveAvatarAsync(Guid userId)
    {
        var user = await GetTrackedUserAsync(userId);

        user.Avatar = null;
        user.AvatarContentType = null;
        await context.SaveChangesAsync();

        avatarCache.Remove(CacheKey(userId));
        return user.ToUserResponse(presence.GetStatus(userId.ToString()));
    }

    public async Task UpdateRanksAsync(Guid player1Id, Guid player2Id, int player1Score, int player2Score)
    {
        const double winPoints = 0.5;
        const double lossPoints = 0.1;
        const double drawPoints = 0.25;

        double p1 = player1Score > player2Score ? winPoints : player1Score < player2Score ? lossPoints : drawPoints;
        double p2 = player2Score > player1Score ? winPoints : player2Score < player1Score ? lossPoints : drawPoints;

        await context.Users
            .Where(u => u.Id == player1Id)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.Rank, u => (u.Rank ?? 0) + p1));

        await context.Users
            .Where(u => u.Id == player2Id)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.Rank, u => (u.Rank ?? 0) + p2));
    }

    public async Task BanUserAsync(Guid actorId, Guid userId)
    {
        var (_, target) = await GetModerationPairAsync(actorId, userId, UserRole.Moderator);

        target.IsBanned = true;
        await context.RefreshTokens.Where(t => t.UserId == target.Id).ExecuteDeleteAsync();
        await context.SaveChangesAsync();
    }

    public async Task UnbanUserAsync(Guid actorId, Guid userId)
    {
        var (_, target) = await GetModerationPairAsync(actorId, userId, UserRole.Moderator);

        target.IsBanned = false;
        await context.SaveChangesAsync();
    }

    public async Task SetRoleAsync(Guid actorId, Guid userId, UserRole role)
    {
        if (!Enum.IsDefined(role) || role is UserRole.All or UserRole.SuperAdmin) throw new AppException(ErrorCode.ValidationError);

        var (actor, target) = await GetModerationPairAsync(actorId, userId, UserRole.Admin);

        if (role >= actor.Role) throw new AppException(ErrorCode.Forbidden);

        target.Role = role;
        await context.RefreshTokens.Where(t => t.UserId == target.Id).ExecuteDeleteAsync();
        await context.SaveChangesAsync();
    }

    public async Task DeleteAccountAsync(Guid actorId, Guid targetId)
    {
        if (actorId != targetId) await GetModerationPairAsync(actorId, targetId, UserRole.Admin);

        await TransactionHelper.ExecuteAsync(context, async () =>
        {
            await DetachUserAsync(targetId);

            var removed = await context.Users
                .Where(u => u.Id == targetId)
                .ExecuteDeleteAsync();

            if (removed == 0) throw new AppException(ErrorCode.UserNotFound);
        });
    }

    private static bool UsernameChanged(User user, string requested) =>
        !string.Equals(user.UserName, requested, StringComparison.Ordinal);

    private static string CacheKey(Guid userId) => $"avatar:{userId}";

    private List<UserSummaryResponse> ApplyPresenceAndStatus(List<UserSummaryResponse> users, UserStatus status)
    {
        var results = users.Select(u => u with { Status = presence.GetStatus(u.Id.ToString()) });
        return status == UserStatus.All ? [.. results] : [.. results.Where(u => u.Status == status)];
    }

    private async Task<User> GetTrackedUserAsync(Guid userId)
        => await context.Users.FirstOrDefaultAsync(u => u.Id == userId)
           ?? throw new AppException(ErrorCode.UserNotFound);

    private async Task<(User Actor, User Target)> GetModerationPairAsync(Guid actorId, Guid targetId, UserRole minimumRole)
    {
        var actor = await GetTrackedUserAsync(actorId);

        if (actor.Role < minimumRole || actorId == targetId) throw new AppException(ErrorCode.Forbidden);

        var target = await GetTrackedUserAsync(targetId);
        if (target.Role >= actor.Role) throw new AppException(ErrorCode.Forbidden);

        return (actor, target);
    }

    private async Task DetachUserAsync(Guid userId)
    {
        await context.Messages.Where(m => m.SenderId == userId || m.ReceiverId == userId).ExecuteDeleteAsync();
        await context.UserFriends.Where(f => f.UserId == userId || f.FriendId == userId).ExecuteDeleteAsync();
        await context.FriendRequests.Where(f => f.SenderId == userId || f.ReceiverId == userId).ExecuteDeleteAsync();
        await context.Blocks.Where(b => b.BlockerId == userId || b.BlockedId == userId).ExecuteDeleteAsync();
        await context.MatchHistories.Where(m => m.Player1Id == userId || m.Player2Id == userId).ExecuteDeleteAsync();
        await context.EmailVerifications.Where(e => e.UserId == userId).ExecuteDeleteAsync();
        await context.RefreshTokens.Where(t => t.UserId == userId).ExecuteDeleteAsync();
    }

    private async Task<(int Total, int Wins, int Losses, int Draws)> GetMatchStatsAsync(Guid userId)
    {
        var result = await context.MatchHistories
            .AsNoTracking()
            .Where(mh => mh.Player1Id == userId || mh.Player2Id == userId)
            .GroupBy(mh => 1)
            .Select(g => new
            {
                Total = g.Count(),
                Wins = g.Count(mh =>
                    (mh.Player1Id == userId && mh.Player1Score > mh.Player2Score) ||
                    (mh.Player2Id == userId && mh.Player2Score > mh.Player1Score)),
                Losses = g.Count(mh =>
                    (mh.Player1Id == userId && mh.Player1Score < mh.Player2Score) ||
                    (mh.Player2Id == userId && mh.Player2Score < mh.Player1Score)),
            })
            .FirstOrDefaultAsync();

        return result == null
            ? (0, 0, 0, 0)
            : (result.Total, result.Wins, result.Losses, result.Total - result.Wins - result.Losses);
    }

    private async Task<List<MatchHistoryResponse>> GetRecentMatchesAsync(Guid userId, int take)
    {
        var matches = await context.MatchHistories
            .AsNoTracking()
            .Where(mh => mh.Player1Id == userId || mh.Player2Id == userId)
            .OrderByDescending(mh => mh.CompletedAt)
            .Take(take)
            .Select(mh => new MatchHistoryResponse
            {
                Id = mh.Id,
                Kind = mh.GameType,
                CompletedAt = mh.CompletedAt,
                Player1Score = mh.Player1Score,
                Player2Score = mh.Player2Score,
                Opponent = mh.Player1Id == userId
                    ? new UserSummaryResponse(mh.Player2.Id, mh.Player2.UserName, mh.Player2.FirstName, mh.Player2.LastName, mh.Player2.FirstName + " " + mh.Player2.LastName, UserStatus.Offline, MappingExtensions.AvatarUrl(mh.Player2.Id, mh.Player2.Avatar))
                    : new UserSummaryResponse(mh.Player1.Id, mh.Player1.UserName, mh.Player1.FirstName, mh.Player1.LastName, mh.Player1.FirstName + " " + mh.Player1.LastName, UserStatus.Offline, MappingExtensions.AvatarUrl(mh.Player1.Id, mh.Player1.Avatar)),
                Result = mh.Player1Id == userId
                    ? ResultOf(mh.Player1Score, mh.Player2Score)
                    : ResultOf(mh.Player2Score, mh.Player1Score)
            })
            .ToListAsync();

        return [.. matches.Select(m => m with
        {
            Opponent = m.Opponent with { Status = presence.GetStatus(m.Opponent.Id.ToString()) }
        })];
    }

    private static MatchStatus ResultOf(int own, int theirs) =>
        own > theirs ? MatchStatus.Win : own < theirs ? MatchStatus.Lost : MatchStatus.Draw;
}
