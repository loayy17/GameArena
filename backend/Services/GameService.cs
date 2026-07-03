using backend.Data;
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class GameService(IDbContextFactory<AppDbContext> _contextFactory) : IGameService
    {
        public async Task SaveMatchHistoryAsync(BaseGameRoom room)
        {
            if (room == null) throw new AppException(ErrorCode.RoomNotFound);

            if (room.Player1Id == null) throw new AppException(ErrorCode.PlayerNotFound);

            if (room.Player2Id == null) throw new AppException(ErrorCode.PlayerNotFound);

            using var context = await _contextFactory.CreateDbContextAsync();

            context.MatchHistories.Add(new MatchHistory
            {
                RoomId = room.RoomId,
                GameType = room.GameType,
                Player1Id = room.Player1Id!,
                Player2Id = room.Player2Id!,
                CompletedAt = DateTime.UtcNow
            });
            await context.SaveChangesAsync();
        }
    }
}
