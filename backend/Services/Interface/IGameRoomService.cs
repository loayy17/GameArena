using System.Text.Json;
using backend.Domain;
using backend.Enums;

namespace backend.Services.Interface
{
    public interface IGameRoomService
    {
        (BaseGameRoom room, bool isNew) FindOrCreateRoom(GamesKind gameType, string playerId, string username);
        BaseGameRoom CreatePrivateRoom(GamesKind gameType, string playerId, string username, string? invitedPlayerId);
        bool TryGetRoom(string roomId, out BaseGameRoom? room);
        bool TryRemoveRoom(string roomId);
        bool TryGetPlayerRoom(string playerId, out string? roomId);
        bool TryRemovePlayer(string playerId);
        bool TryJoinRoom(string roomId, string playerId, string? username);
        void RemoveRoomAndPlayers(string roomId);
        void StartGameLoop(string roomId);
        void StopGameLoop(string roomId);
        Task ProcessActionAsync(string roomId, string playerId, JsonElement action);
        Task RequestPlayAgainAsync(string roomId, string playerId);
        Task RespondPlayAgainAsync(string roomId, string playerId, bool accept);
        Task FinishAndCleanupAsync(BaseGameRoom room, string roomId, bool removeRoom = true);
    }
}
