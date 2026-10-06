using backend.Domain;
using backend.Enums;

namespace backend.Services.Interface;

public interface IGameSessionService
{
    Task<SessionJoinResult> RejoinAsync(string playerId);
    Task<SessionJoinResult> FindMatchAsync(string playerId, string username, GamesKind gameType, BotDifficulty difficulty);
    Task<SessionJoinResult> CreateLobbyAsync(string playerId, string username, GamesKind gameType, BotDifficulty difficulty);
    Task<SessionJoinResult> InviteFriendAsync(string playerId, string username, string friendId, GamesKind gameType, BotDifficulty difficulty);
    Task<SessionJoinResult> OpenSeatAsync(string playerId, string friendId);
    Task<bool> AcceptInviteAsync(string playerId, string? username, string roomId);
}

public sealed record SessionJoinResult(BaseGameRoom? Room, bool Joined = false, bool CreatedNewRoom = false)
{
    public static readonly SessionJoinResult None = new(Room: null);
    public string? RoomId => Room?.RoomId;
}
