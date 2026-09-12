using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class MatchHistoryService(AppDbContext _context, IUserPresenceService _presence) : IMatchHistoryService
    {
        public async Task<List<MatchHistoryResponse>> GetMatchHistoryByUserIdAsync(Guid userId)
        {
            var rows = await _context.MatchHistories
                .AsNoTracking()
                .Where(mh => mh.Player1Id == userId || mh.Player2Id == userId)
                .OrderByDescending(m => m.CompletedAt)
                .Select(m => new
                {
                    m.Id,
                    m.GameType,
                    m.CompletedAt,
                    m.Player1Score,
                    m.Player2Score,
                    IsP1 = m.Player1Id == userId,
                    OpponentId = m.Player1Id == userId ? m.Player2Id!.Value : m.Player1Id!.Value,
                    OpponentUserName = m.Player1Id == userId ? m.Player2.UserName : m.Player1.UserName,
                    OpponentFirstName = m.Player1Id == userId ? m.Player2.FirstName : m.Player1.FirstName,
                    OpponentLastName = m.Player1Id == userId ? m.Player2.LastName : m.Player1.LastName,
                    OpponentFullName = m.Player1Id == userId ? m.Player2.FirstName + " " + m.Player2.LastName : m.Player1.FirstName + " " + m.Player1.LastName,
                    OpponentAvatarUrl = m.Player1Id == userId
                        ? MappingExtensions.AvatarUrl(m.Player2.Id, m.Player2.Avatar)
                        : MappingExtensions.AvatarUrl(m.Player1.Id, m.Player1.Avatar)
                })
                .ToListAsync();

            return rows.Select(m => new MatchHistoryResponse
            {
                Id = m.Id,
                Kind = m.GameType,
                CompletedAt = m.CompletedAt,
                Player1Score = m.Player1Score,
                Player2Score = m.Player2Score,
                Opponent = new UserSummaryResponse(m.OpponentId, m.OpponentUserName, m.OpponentFirstName, m.OpponentLastName, m.OpponentFullName, _presence.GetStatus(m.OpponentId.ToString()), m.OpponentAvatarUrl),
                Result = m.IsP1
                    ? (m.Player1Score > m.Player2Score ? MatchStatus.Win : m.Player1Score < m.Player2Score ? MatchStatus.Lost : MatchStatus.Draw)
                    : (m.Player2Score > m.Player1Score ? MatchStatus.Win : m.Player2Score < m.Player1Score ? MatchStatus.Lost : MatchStatus.Draw)
            }).ToList();
        }

        public async Task SaveMatchHistoryAsync(string roomId, GamesKind gameType, Guid player1Id, Guid player2Id, int player1Score, int player2Score)
        {
            if (string.IsNullOrWhiteSpace(roomId))
                throw new AppException(ErrorCode.RoomNotFound);

            _context.MatchHistories.Add(new MatchHistory
            {
                RoomId = roomId,
                GameType = gameType,
                Player1Id = player1Id,
                Player2Id = player2Id,
                Player1Score = player1Score,
                Player2Score = player2Score,
                CompletedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }
    }
}
