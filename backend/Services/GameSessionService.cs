using backend.Domain;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;

namespace backend.Services;

public class GameSessionService(IGameRoomService rooms, INotificationService notifications, IEventBus eventBus)
    : IGameSessionService
{
    public async Task<SessionJoinResult> RejoinAsync(string playerId)
    {
        if (!TryLocate(playerId, out var room, out var roomId)) return SessionJoinResult.None;
        if (room!.WinnerPlayerId != null)
        {
            await rooms.LeaveGameAsync(playerId);
            return SessionJoinResult.None;
        }

        return new SessionJoinResult(room, Joined: true);
    }

    public async Task<SessionJoinResult> FindMatchAsync(string playerId, string username, GamesKind gameType, BotDifficulty difficulty)
    {
        if (TryReuse(playerId, gameType, out var reusable)) return reusable;
        await rooms.LeaveGameAsync(playerId);
        var (room, _) = rooms.FindOrCreateRoom(gameType, playerId, username, difficulty);
        return new SessionJoinResult(room, Joined: true);
    }

    public async Task<SessionJoinResult> CreateLobbyAsync(string playerId, string username, GamesKind gameType, BotDifficulty difficulty)
    {
        await rooms.LeaveGameAsync(playerId);

        var room = rooms.CreatePrivateRoom(gameType, playerId, username, null, difficulty);
        return new SessionJoinResult(room, Joined: true);
    }

    public async Task<SessionJoinResult> InviteFriendAsync(string playerId, string username, string friendId, GamesKind gameType, BotDifficulty difficulty)
    {
        if (TryReuse(playerId, gameType, out var reusable)) return reusable;
        await rooms.LeaveGameAsync(playerId);
        var room = rooms.CreatePrivateRoom(gameType, playerId, username, friendId, difficulty);
        await eventBus.PublishAsync(new GameInviteSentEvent(friendId, room.RoomId, playerId, username, gameType));
        return new SessionJoinResult(room, Joined: true, CreatedNewRoom: true);
    }

    public async Task<SessionJoinResult> OpenSeatAsync(string playerId, string friendId)
    {
        if (!TryLocate(playerId, out var room, out _)) return SessionJoinResult.None;
        if (room!.IsFinished || room.IsFull) return SessionJoinResult.None;
        room.InvitedPlayerId = friendId;
        return new SessionJoinResult(room);
    }

    public async Task<bool> AcceptInviteAsync(string playerId, string? username, string roomId)
    {
        if (string.IsNullOrEmpty(roomId)) throw new AppException(ErrorCode.InvalidRoomId);
        if (!rooms.TryJoinRoom(roomId, playerId, username)) return false;
        if (Guid.TryParse(playerId, out var joinerId)) await notifications.DeleteNotificationsByReferenceAsync(joinerId, NotificationType.GameInvite, roomId);

        return true;
    }

    private bool TryReuse(string playerId, GamesKind gameType, out SessionJoinResult result)
    {
        result = SessionJoinResult.None;

        if (!TryLocate(playerId, out var room, out var roomId)) return false;

        if (room!.GameType != gameType || room.WinnerPlayerId != null) return false;

        result = new SessionJoinResult(room, Joined: true);
        return true;
    }

    private bool TryLocate(string playerId, out BaseGameRoom? room, out string? roomId)
    {
        room = null;
        roomId = null;

        return rooms.TryGetPlayerRoom(playerId, out roomId)
            && roomId != null
            && rooms.TryGetRoom(roomId, out room)
            && room != null;
    }
}
