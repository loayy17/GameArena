using System.Text.Json;
using backend.Domain;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

[Authorize]
public class GameHub(
    IGameRoomService rooms,
    IGameSessionService sessions,
    ILogger<GameHub> logger) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var playerId = Context.UserIdentifier;

        if (playerId != null)
        {
            rooms.RegisterConnection(playerId, Context.ConnectionId);

            var result = await sessions.RejoinAsync(playerId);
            if (result.Joined) await AttachAsync(result.RoomId!, result.Room!);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (exception != null) logger.LogWarning(exception, "GameHub connection dropped for user {UserId}", Context.UserIdentifier);

        if (Context.UserIdentifier is { } playerId) await rooms.UnregisterConnectionAsync(playerId, Context.ConnectionId);

        await base.OnDisconnectedAsync(exception);
    }

    public async Task FindMatch(GamesKind gameType, BotDifficulty difficulty = BotDifficulty.Medium)
    {
        var result = await Run(() => sessions.FindMatchAsync(PlayerId, Username, gameType, difficulty));
        if (result.Joined) await AttachAsync(result.RoomId!, result.Room!, broadcast: result.CreatedNewRoom);
    }

    public async Task CreateLobby(GamesKind gameType, BotDifficulty difficulty = BotDifficulty.Medium)
    {
        var result = await Run(() => sessions.CreateLobbyAsync(PlayerId, Username, gameType, difficulty));
        if (result.Joined) await AttachAsync(result.RoomId!, result.Room!);
    }

    public async Task InviteFriend(string friendId, GamesKind gameType, BotDifficulty difficulty = BotDifficulty.Medium)
    {
        var result = await Run(() => sessions.InviteFriendAsync(PlayerId, Username, friendId, gameType, difficulty));
        if (result.Joined) await AttachAsync(result.RoomId!, result.Room!, broadcast: result.CreatedNewRoom);
        if (result.CreatedNewRoom) await SendInviteAsync(friendId, result.RoomId, gameType);
    }

    public async Task InviteToRoom(string friendId)
    {
        var result = await sessions.OpenSeatAsync(PlayerId, friendId);
        if (result.Room is null) return;
        await SendInviteAsync(friendId, result.RoomId, result.Room.GameType);
    }

    public async Task AcceptInvite(string roomId)
    {
        if (!await Run(() => sessions.AcceptInviteAsync(PlayerId, Username, roomId))) return;
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        if (rooms.TryGetRoom(roomId, out var room)) await Clients.Group(roomId).SendAsync("gameState", room!.GetStatePayload());
    }

    public async Task StartGame(string? friendId, GamesKind gameKind)
    {
        if (!TryLocate(out var room, out var roomId) || room!.GameType != gameKind) return;
        if (!await rooms.StartGameAsync(roomId!, PlayerId, friendId)) return;
        await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());
    }

    public async Task SendAction(JsonElement action)
    {
        if (!TryLocate(out var room, out var roomId)
            || room!.IsFinished
            || room.WinnerPlayerId != null
            || !room.HasStarted
            || !IsSeated(room, PlayerId))
            return;

        try
        {
            await rooms.ProcessActionAsync(roomId!, PlayerId, action);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Action failed for player {PlayerId} in room {RoomId}", PlayerId, roomId);
            throw new HubException("Failed to process game action");
        }
    }

    public async Task RequestPlayAgain()
    {
        if (TryLocate(out _, out var roomId)) await rooms.RequestPlayAgainAsync(roomId!, PlayerId);
    }

    public async Task RespondPlayAgain(bool accept)
    {
        if (TryLocate(out _, out var roomId)) await rooms.RespondPlayAgainAsync(roomId!, PlayerId, accept);
    }

    public async Task LeaveGame()
    {
        if (!TryLocate(out _, out var roomId)) return;

        await rooms.LeaveGameAsync(PlayerId);
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);
    }

    public async Task CancelSearch()
    {
        if (TryLocate(out var room, out var roomId) && !room!.IsFull) await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);

        await rooms.CancelSearchAsync(PlayerId);
    }

    private string PlayerId => Context.UserIdentifier ?? throw new HubException("Unauthorized");
    private static async Task<T> Run<T>(Func<Task<T>> action)
    {
        try
        {
            return await action();
        }
        catch (AppException ex)
        {
            throw new HubException(ex.Message);
        }
    }

    private string Username => Context.User?.Identity?.Name ?? "Player";
    private bool TryLocate(out BaseGameRoom? room, out string? roomId)
    {
        room = null;
        roomId = null;

        return rooms.TryGetPlayerRoom(PlayerId, out roomId)
            && roomId != null
            && rooms.TryGetRoom(roomId, out room)
            && room != null;
    }

    private static bool IsSeated(BaseGameRoom room, string playerId) =>
        room.Player1Id == playerId || room.Player2Id == playerId;
    private async Task AttachAsync(string roomId, BaseGameRoom room, bool broadcast = false)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
        if (broadcast) await Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
        else await Clients.Caller.SendAsync("gameState", room.GetStatePayload());
    }

    private Task SendInviteAsync(string friendId, string? roomId, GamesKind gameType) =>
        Clients.User(friendId).SendAsync("game:invite", new
        {
            roomId,
            gameType = (int)gameType,
            inviterId = PlayerId,
            inviterName = Username
        });
}
