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
    public class UserService(AppDbContext _context, IUserPresenceService _presence, IEmailVerificationService _emailVerificationService) : IUserService
    {
        public async Task<UserResponse> GetUserByIdAsync(Guid userId)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new AppException(ErrorCode.UserNotFound);

            return user.ToDto(_presence);
        }

        public async Task<UserPublicProfileResponse> GetUserProfileAsync(Guid userId, Guid viewerId)
        {
            var isSelf = userId == viewerId;

            var data = await _context.Users
                .AsNoTracking()
                .Where(u => u.Id == userId)
                .Select(u => new
                {
                    Profile = new UserPublicProfileResponse
                    {
                        Id = u.Id,
                        UserName = u.UserName,
                        FirstName = u.FirstName,
                        LastName = u.LastName,
                        FullName = u.FirstName + " " + u.LastName,
                        AvatarUrl = MappingExtensions.AvatarUrl(u.Id, u.Avatar),
                        CreatedAt = u.CreatedAt,
                        Rank = u.Rank
                    },
                    CanViewStats = isSelf || _context.UserFriends.Any(f =>
                        (f.UserId == viewerId && f.FriendId == u.Id) ||
                        (f.UserId == u.Id && f.FriendId == viewerId))
                })
                .FirstOrDefaultAsync()
                ?? throw new AppException(ErrorCode.UserNotFound);

            var result = data.Profile with { Status = _presence.GetStatus(userId.ToString()) };

            if (!data.CanViewStats)
                return result;

            var stats = await GetMatchStatsAsync(userId);
            var matches = await GetMatchProjectionsAsync(userId, 10);

            return result with
            {
                TotalMatches = stats.Total,
                Wins = stats.Wins,
                Losses = stats.Losses,
                Draws = stats.Draws,
                WinRate = stats.Total == 0 ? 0 : Math.Round(stats.Wins * 100.0 / stats.Total, 1),
                RecentMatches = matches
            };
        }

        public async Task<List<UserSummaryResponse>> GetUsersAsync(Guid currentUserId, UserFilterRequest? filter)
        {
            if (string.IsNullOrWhiteSpace(filter?.Name))
                return [];

            var users = await GetUserSearchQuery(currentUserId, filter)
                .Select(MappingExtensions.ToSummaryResponse)
                .ToListAsync();

            var results = users.Select(u =>
                u with { Status = _presence.GetStatus(u.Id.ToString()) });

            if (filter.UserStatus != UserStatus.All)
                results = results.Where(u => u.Status == filter.UserStatus);

            return [.. results];
        }

        public async Task<List<AdminUserResponse>> GetUsersByAdminAsync(UserFilterRequest? filter)
        {
            var name = filter?.Name?.Trim() ?? string.Empty;
            var role = filter?.UserRole ?? UserRole.All;
            var status = filter?.UserStatus ?? UserStatus.All;

            var query = _context.Users.AsNoTracking().AsQueryable();

            if (name.Length > 0)
            {
                query = query.Where(u =>
                    EF.Functions.ILike(u.UserName, $"%{name}%") ||
                    EF.Functions.ILike(u.FirstName, $"%{name}%") ||
                    EF.Functions.ILike(u.LastName, $"%{name}%") ||
                    EF.Functions.ILike(u.FirstName + " " + u.LastName, $"%{name}%"));
            }

            if (role != UserRole.All)
                query = query.Where(u => u.Role == role);

            var users = await query
                .OrderBy(u => u.UserName)
                .Select(MappingExtensions.ToAdminResponse)
                .ToListAsync();

            var results = users.Select(u =>
                u with { Status = _presence.GetStatus(u.Id.ToString()) });

            if (status != UserStatus.All)
                results = results.Where(u => u.Status == status);

            return [.. results];
        }

        public async Task<AdminStatsResponse> GetStatsAsync()
        {
            var total = await _context.Users.AsNoTracking().CountAsync();
            var banned = await _context.Users.AsNoTracking().CountAsync(u => u.IsBanned);
            var (online, inGame) = _presence.GetOnlineCounts();

            return new AdminStatsResponse
            {
                TotalUsers = total,
                OnlineUsers = online,
                InGameUsers = inGame,
                BannedUsers = banned
            };
        }

        public async Task<string?> GetPreferencesAsync(Guid userId)
            => await _context.Users.Where(u => u.Id == userId).Select(u => u.Preferences).FirstOrDefaultAsync()
               ?? throw new AppException(ErrorCode.UserNotFound);

        public async Task<(byte[] Bytes, string ContentType)?> GetAvatarAsync(Guid userId)
        {
            var avatar = await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => new { u.Avatar, u.AvatarContentType })
                .FirstOrDefaultAsync();
            if (avatar?.Avatar == null || string.IsNullOrEmpty(avatar.AvatarContentType))
                return null;

            return (avatar.Avatar, avatar.AvatarContentType);
        }

        public async Task<UserResponse> UpdateProfileAsync(Guid userId, UpdateProfileRequest request)
        {
            var user = await GetUserForUpdateAsync(userId);
            var emailChanged = !string.Equals(user.Email, request.Email, StringComparison.OrdinalIgnoreCase);
            if (!string.Equals(user.UserName, request.UserName, StringComparison.Ordinal)
                && await _context.Users.AnyAsync(u => u.Id != userId && u.UserName == request.UserName))
                throw new AppException(ErrorCode.UsernameAlreadyExists);
            if (emailChanged
                && await _context.Users.AnyAsync(u => u.Id != userId && u.Email == request.Email))
                throw new AppException(ErrorCode.EmailAlreadyExists);

            user.UserName = request.UserName;
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;

            if (emailChanged)
            {
                user.Email = request.Email;
                user.IsVerified = false;
            }
            await _context.SaveChangesAsync();

            if (emailChanged) await _emailVerificationService.GenerateAndSendOtpAsync(request.Email, OtpPurpose.EmailVerification);
            
            return user.ToDto(_presence);
        }

        public async Task ChangePasswordAsync(Guid userId, string oldPassword, string newPassword)
        {
            await TransactionHelper.ExecuteAsync(_context, async () =>
            {
                var user = await GetUserForUpdateAsync(userId);
                if (!AuthHelper.VerifyPassword(user, user.PasswordHash, oldPassword))
                    throw new AppException(ErrorCode.InvalidCredentials);
                user.PasswordHash = AuthHelper.HashPassword(user, newPassword);
                await _context.SaveChangesAsync();
                await _context.RefreshTokens.Where(t => t.UserId == userId).ExecuteDeleteAsync();
            });
        }

        public async Task UpdatePreferencesAsync(Guid userId, string preferencesJson)
        {
            var rows = await _context.Users.Where(u => u.Id == userId)
                .ExecuteUpdateAsync(s => s.SetProperty(u => u.Preferences, preferencesJson));
            if (rows == 0) throw new AppException(ErrorCode.UserNotFound);
        }

        public async Task<UserResponse> UpdateAvatarAsync(Guid userId, IFormFile file)
        {
            if (file.Length <= 0 || file.Length > ValidationRules.AvatarMaxBytes || !ValidationRules.AllowedAvatarTypes.Contains(file.ContentType))
                throw new AppException(ErrorCode.InvalidAvatar);

            var user = await GetUserForUpdateAsync(userId);
            await using var stream = new MemoryStream();
            await file.CopyToAsync(stream);
            user.Avatar = stream.ToArray();
            user.AvatarContentType = file.ContentType;
            await _context.SaveChangesAsync();
            return user.ToDto(_presence);
        }

        public async Task<UserResponse> RemoveAvatarAsync(Guid userId)
        {
            var user = await GetUserForUpdateAsync(userId);
            user.Avatar = null;
            user.AvatarContentType = null;
            await _context.SaveChangesAsync();
            return user.ToDto(_presence);
        }

        public async Task UpdateRanksAsync(Guid player1Id, Guid player2Id, int player1Score, int player2Score)
        {
            var p1Delta = player1Score > player2Score ? 0.5 : player1Score < player2Score ? 0.1 : 0.25;
            var p2Delta = player2Score > player1Score ? 0.5 : player2Score < player1Score ? 0.1 : 0.25;
            await _context.Users.Where(u => u.Id == player1Id)
                .ExecuteUpdateAsync(s => s.SetProperty(u => u.Rank, u => (u.Rank ?? 0) + p1Delta));
            await _context.Users.Where(u => u.Id == player2Id)
                .ExecuteUpdateAsync(s => s.SetProperty(u => u.Rank, u => (u.Rank ?? 0) + p2Delta));
        }

        public async Task BanUserAsync(Guid actorId, Guid userId)
        {
            var (_, target) = await GetModerationPairAsync(actorId, userId, UserRole.Moderator);
            target.IsBanned = true;
            await RevokeTokensAsync(target.Id);
            await _context.SaveChangesAsync();
        }

        public async Task UnbanUserAsync(Guid actorId, Guid userId)
        {
            var (_, target) = await GetModerationPairAsync(actorId, userId, UserRole.Moderator);
            target.IsBanned = false;
            await _context.SaveChangesAsync();
        }

        public async Task SetRoleAsync(Guid actorId, Guid userId, UserRole role)
        {
            if (!Enum.IsDefined(role) || role == UserRole.All)
                throw new AppException(ErrorCode.ValidationError);

            var actor = await _context.Users.FirstOrDefaultAsync(u => u.Id == actorId)
                ?? throw new AppException(ErrorCode.UserNotFound);

            if (actor.Role != UserRole.Admin && actor.Role != UserRole.SuperAdmin)
                throw new AppException(ErrorCode.Forbidden);

            if (actor.Role == UserRole.Admin && role != UserRole.User && role != UserRole.Moderator)
                throw new AppException(ErrorCode.Forbidden);

            if (actorId == userId)
                throw new AppException(ErrorCode.Forbidden);

            var target = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new AppException(ErrorCode.UserNotFound);

            if (target.Role >= actor.Role)
                throw new AppException(ErrorCode.Forbidden);

            target.Role = role;
            await RevokeTokensAsync(target.Id);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAccountAsync(Guid actorId, Guid targetId)
        {
            if (actorId != targetId)
                await GetModerationPairAsync(actorId, targetId, UserRole.Admin);

            await TransactionHelper.ExecuteAsync(_context, async () =>
            {
                await _context.Messages
                    .Where(m => m.SenderId == targetId || m.ReceiverId == targetId)
                    .ExecuteDeleteAsync();
                await _context.UserFriends
                    .Where(f => f.UserId == targetId || f.FriendId == targetId)
                    .ExecuteDeleteAsync();
                await _context.FriendRequests
                    .Where(f => f.SenderId == targetId || f.ReceiverId == targetId)
                    .ExecuteDeleteAsync();
                await _context.Blocks
                    .Where(b => b.BlockerId == targetId || b.BlockedId == targetId)
                    .ExecuteDeleteAsync();
                await _context.MatchHistories
                    .Where(m => m.Player1Id == targetId || m.Player2Id == targetId)
                    .ExecuteDeleteAsync();
                await _context.EmailVerifications
                    .Where(e => e.UserId == targetId)
                    .ExecuteDeleteAsync();
                await _context.RefreshTokens
                    .Where(t => t.UserId == targetId)
                    .ExecuteDeleteAsync();

                var removed = await _context.Users
                    .Where(u => u.Id == targetId)
                    .ExecuteDeleteAsync();
                if (removed == 0)
                    throw new AppException(ErrorCode.UserNotFound);
            });
        }

        private async Task<User> GetUserForUpdateAsync(Guid userId)
            => await _context.Users.FirstOrDefaultAsync(u => u.Id == userId)
               ?? throw new AppException(ErrorCode.UserNotFound);

        private async Task<(User Actor, User Target)> GetModerationPairAsync(Guid actorId, Guid userId, UserRole minPower)
        {
            var actor = await _context.Users.FirstOrDefaultAsync(u => u.Id == actorId)
                ?? throw new AppException(ErrorCode.UserNotFound);

            if (actor.Role < minPower)
                throw new AppException(ErrorCode.Forbidden);

            if (actorId == userId)
                throw new AppException(ErrorCode.Forbidden);

            var target = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId)
                ?? throw new AppException(ErrorCode.UserNotFound);

            if (target.Role >= actor.Role)
                throw new AppException(ErrorCode.Forbidden);

            return (actor, target);
        }

        private async Task RevokeTokensAsync(Guid userId)
        {
            await _context.RefreshTokens.Where(t => t.UserId == userId).ExecuteDeleteAsync();
        }

        private IQueryable<User> GetUserSearchQuery(Guid currentUserId, UserFilterRequest filter)
        {
            var name = filter.Name!.Trim();

            var query = _context.Users
                .AsNoTracking()
                .Where(u => u.Id != currentUserId)
                .Where(u => !u.IsBanned)
                .Where(u => !_context.Blocks.Any(b =>
                    (b.BlockerId == currentUserId && b.BlockedId == u.Id) ||
                    (b.BlockedId == currentUserId && b.BlockerId == u.Id)))
                .Where(u =>
                    EF.Functions.ILike(u.UserName, $"%{name}%") ||
                    EF.Functions.ILike(u.FirstName, $"%{name}%") ||
                    EF.Functions.ILike(u.LastName, $"%{name}%") ||
                    EF.Functions.ILike(u.FirstName + " " + u.LastName, $"%{name}%"));

            if (filter.UserRole != UserRole.All)
                query = query.Where(u => u.Role == filter.UserRole);

            return query;
        }

        private async Task<(int Total, int Wins, int Losses, int Draws)> GetMatchStatsAsync(Guid userId)
        {
            var result = await _context.MatchHistories
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

            if (result == null) return (0, 0, 0, 0);

            var draws = result.Total - result.Wins - result.Losses;
            return (result.Total, result.Wins, result.Losses, draws);
        }

        private async Task<List<MatchHistoryResponse>> GetMatchProjectionsAsync(Guid userId, int take)
        {
            var matches = await _context.MatchHistories
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
                        ? (mh.Player1Score > mh.Player2Score ? MatchStatus.Win : mh.Player1Score < mh.Player2Score ? MatchStatus.Lost : MatchStatus.Draw)
                        : (mh.Player2Score > mh.Player1Score ? MatchStatus.Win : mh.Player2Score < mh.Player1Score ? MatchStatus.Lost : MatchStatus.Draw)
                })
                .ToListAsync();

            return matches
                .Select(m => m with
                {
                    Opponent = m.Opponent with
                    {
                        Status = _presence.GetStatus(m.Opponent.Id.ToString())
                    }
                })
                .ToList();
        }
    }
}
