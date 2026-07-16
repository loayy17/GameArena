using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class MatchHistoryService(AppDbContext _context) : IMatchHistoryService
    {
        public async Task<List<MatchHistoryResponse>> GetMatchHistoryByUserIdAsync(Guid userId)
        {
            var matches = await _context.MatchHistories
                .Include(m => m.Player1)
                .Include(m => m.Player2)
                .Where(mh => mh.Player1Id == userId || mh.Player2Id == userId)
                .OrderByDescending(m => m.CompletedAt)
                .ToListAsync();

            return [.. matches.Select(m => MapperHelper.ToDto(m, userId))];
        }

        public async Task SaveMatchHistoryAsync(BaseGameRoom room)
        {
            if (room?.Player1Id == null || room.Player2Id == null)
                throw new AppException(room == null ? ErrorCode.RoomNotFound : ErrorCode.PlayerNotFound);

            if (!Guid.TryParse(room.Player1Id, out var p1)
                || !Guid.TryParse(room.Player2Id, out var p2))
                return;

            _context.MatchHistories.Add(new MatchHistory
            {
                RoomId = room.RoomId,
                GameType = room.GameType,
                Player1Id = p1,
                Player2Id = p2,
                Player1Score = room.Score?[0] ?? 0,
                Player2Score = room.Score?[1] ?? 0,
                CompletedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }
    }
}
