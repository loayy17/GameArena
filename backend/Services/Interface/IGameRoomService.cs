using System.Text.Json;
using backend.Domain;
using backend.Enums;

namespace backend.Services.Interface;

public interface IGameRoomService
{
    (BaseGameRoom room, bool isNew) FindOrCreateRoom(GamesKind gameType, string playerId, string username, BotDifficulty difficulty = BotDifficulty.Medium);
    BaseGameRoom CreatePrivateRoom(GamesKind gameType, string playerId, string username, string? invitedPlayerId, BotDifficulty difficulty = BotDifficulty.Medium);

    bool TryGetRoom(string roomId, out BaseGameRoom? room);
    bool TryGetPlayerRoom(string playerId, out string? roomId);
    bool TryJoinRoom(string roomId, string playerId, string? username);

    void RegisterConnection(string playerId, string connectionId);
    Task UnregisterConnectionAsync(string playerId, string connectionId);

    Task ProcessActionAsync(string roomId, string playerId, JsonElement action);
    Task<bool> StartGameAsync(string roomId, string playerId, string? friendId);
    Task RequestPlayAgainAsync(string roomId, string playerId);
    Task RespondPlayAgainAsync(string roomId, string playerId, bool accept);
    Task LeaveGameAsync(string playerId);
    Task CancelSearchAsync(string playerId);
}
