using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;

namespace backend.Services
{
    public class GameService(AppDbContext _context) : IGameService
    {
        public async Task SaveMatchHistoryAsync(BaseGameRoom room)
        {
            if (room?.Player1Id == null || room.Player2Id == null)
                throw new AppException(room == null ? ErrorCode.RoomNotFound : ErrorCode.PlayerNotFound);

            _context.MatchHistories.Add(new MatchHistory
            {
                RoomId = room.RoomId,
                GameType = room.GameType,
                Player1Id = room.Player1Id,
                Player2Id = room.Player2Id,
                CompletedAt = DateTime.UtcNow
            });
            await _context.SaveChangesAsync();
        }
    }
}
