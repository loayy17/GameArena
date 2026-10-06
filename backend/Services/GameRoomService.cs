using System.Collections.Concurrent;
using System.Text.Json;
using backend.Domain;
using backend.Enums;
using backend.Events;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;

namespace backend.Services;

public class GameRoomService(
    IHubContext<GameHub> hub,
    IServiceScopeFactory scopeFactory,
    IEventBus eventBus,
    ILogger<GameRoomService> logger) : IGameRoomService
{
    internal static readonly TimeSpan ReconnectGrace = TimeSpan.FromSeconds(30);

    private readonly ConcurrentDictionary<string, BaseGameRoom> _rooms = new();
    private readonly ConcurrentDictionary<string, string> _playerRooms = new();
    private readonly ConcurrentDictionary<string, CancellationTokenSource> _gameLoops = new();
    private readonly ConcurrentDictionary<string, string> _playAgainRequests = new();
    private readonly ConcurrentDictionary<string, HashSet<string>> _playerConnections = new();
    private readonly ConcurrentDictionary<string, CancellationTokenSource> _disconnectGraces = new();

    private readonly Lock _matchLock = new();

    public (BaseGameRoom room, bool isNew) FindOrCreateRoom(GamesKind gameType, string playerId, string username, BotDifficulty difficulty = BotDifficulty.Medium)
    {
        ForgetPlayerRoom(playerId);

        lock (_matchLock)
        {
            var open = _rooms.Values.FirstOrDefault(r =>
                r.GameType == gameType && !r.IsFull && !r.IsPrivate && r.Player1Id != playerId);

            if (open != null)
            {
                SeatSecondPlayer(open, playerId, username);
                _playerRooms[playerId] = open.RoomId;
                return (open, false);
            }

            var room = NewRoom(gameType, playerId, username, difficulty, isPrivate: false);
            return (room, true);
        }
    }

    public BaseGameRoom CreatePrivateRoom(GamesKind gameType, string playerId, string username, string? invitedPlayerId, BotDifficulty difficulty = BotDifficulty.Medium)
    {
        ForgetPlayerRoom(playerId);

        lock (_matchLock)
        {
            var room = NewRoom(gameType, playerId, username, difficulty, isPrivate: true);
            room.InvitedPlayerId = invitedPlayerId;
            return room;
        }
    }

    public bool TryGetRoom(string roomId, out BaseGameRoom? room) => _rooms.TryGetValue(roomId, out room);

    public bool TryGetPlayerRoom(string playerId, out string? roomId) => _playerRooms.TryGetValue(playerId, out roomId);

    public bool TryJoinRoom(string roomId, string playerId, string? username)
    {
        ForgetPlayerRoom(playerId);

        lock (_matchLock)
        {
            if (!_rooms.TryGetValue(roomId, out var room)
                || room.IsFull
                || room.Player1Id == playerId
                || room.InvitedPlayerId != playerId)
            {
                return false;
            }

            SeatSecondPlayer(room, playerId, username);
            _playerRooms[playerId] = roomId;
            return true;
        }
    }

    public void RemoveRoomAndPlayers(string roomId)
    {
        StopGameLoop(roomId);
        _playAgainRequests.TryRemove(roomId, out _);

        if (!_rooms.TryRemove(roomId, out var room)) return;

        CancelPendingInvite(room, roomId);

        ForgetSeatedPlayer(room.Player1Id);
        ForgetSeatedPlayer(room.Player2Id);
    }

    public void RegisterConnection(string playerId, string connectionId)
    {
        var connections = _playerConnections.GetOrAdd(playerId, _ => []);
        lock (connections)
        {
            connections.Add(connectionId);
        }

        CancelDisconnectGrace(playerId);
    }

    public Task UnregisterConnectionAsync(string playerId, string connectionId)
    {
        if (!_playerConnections.TryGetValue(playerId, out var connections)) return Task.CompletedTask;

        lock (connections)
        {
            connections.Remove(connectionId);
        }

        if (connections.Count > 0) return Task.CompletedTask;

        _playerConnections.TryRemove(playerId, out _);

        if (_playerRooms.ContainsKey(playerId)) ScheduleDisconnectGrace(playerId);

        return Task.CompletedTask;
    }

    public async Task ProcessActionAsync(string roomId, string playerId, JsonElement action)
    {
        if (!_rooms.TryGetValue(roomId, out var room)) return;

        try
        {
            room.HandleAction(playerId, action);

            if (room.IsBotGame && room.NeedsGameLoop) room.MakeBotMove();

            await hub.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());

            if (room.WinnerPlayerId != null) await CompleteRoundAsync(room, roomId);
            else if (room.IsBotGame && !room.NeedsGameLoop)
            {
                _ = RunBotMoveAsync(room, roomId);
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to process action for room {RoomId}", roomId);
        }
    }

    public async Task<bool> StartGameAsync(string roomId, string playerId, string? friendId)
    {
        if (!_rooms.TryGetValue(roomId, out var room)
            || room.Player1Id != playerId
            || room.HasStarted)
        {
            return false;
        }

        if (room.Player2Id == null)
        {
            room.Player2Id = Constants.BotPlayerId;
            room.Player2Username = Constants.BotPlayerName;
            room.IsFull = true;
            room.IsBotGame = true;
        }
        else if (friendId != null && room.Player2Id != friendId)
        {
            return false;
        }

        room.HumanPlayer1Id = room.Player1Id;
        room.HumanPlayer2Id = room.Player2Id == Constants.BotPlayerId ? null : room.Player2Id;
        room.HasStarted = true;
        room.CurrentTurnPlayerId = room.Player1Id;
        room.ResetForNewRound();

        await eventBus.PublishAsync(new GameStartedEvent(room.Player1Id!, room.Player2Id!));

        StartGameLoop(roomId);
        return true;
    }

    public async Task RequestPlayAgainAsync(string roomId, string playerId)
    {
        if (!_rooms.TryGetValue(roomId, out var room) || room.WinnerPlayerId == null) return;

        if (room.IsBotGame)
        {
            await AcceptPlayAgainAsync(roomId, room);
            return;
        }

        var opponentId = OpponentOf(room, playerId);
        if (opponentId == null) return;

        if (_playAgainRequests.TryGetValue(roomId, out var requester) && requester == opponentId)
        {
            _playAgainRequests.TryRemove(roomId, out _);
            await AcceptPlayAgainAsync(roomId, room);
            return;
        }

        _playAgainRequests[roomId] = playerId;

        await hub.Clients.User(opponentId).SendAsync("playAgainRequest", new
        {
            requesterId = playerId,
            requesterUsername = playerId == room.Player1Id ? room.Player1Username : room.Player2Username
        });
    }

    public async Task RespondPlayAgainAsync(string roomId, string playerId, bool accept)
    {
        _playAgainRequests.TryRemove(roomId, out _);

        if (!_rooms.TryGetValue(roomId, out var room)) return;

        if (accept)
        {
            await AcceptPlayAgainAsync(roomId, room);
            return;
        }

        room.IsFinished = true;
        await hub.Clients.Group(roomId).SendAsync("playAgainResponse", new { accepted = false });
        RemoveRoomAndPlayers(roomId);
    }

    public async Task LeaveGameAsync(string playerId)
    {
        CancelDisconnectGrace(playerId);

        if (!TryGetPlayerRoom(playerId, out var roomId)
            || roomId == null
            || !_rooms.TryGetValue(roomId, out var room))
        {
            return;
        }

        await HandleDepartureAsync(room, roomId, playerId);
    }

    public Task CancelSearchAsync(string playerId)
    {
        if (TryGetPlayerRoom(playerId, out var roomId)
            && roomId != null
            && _rooms.TryGetValue(roomId, out var room)
            && !room.IsFull)
        {
            RemoveRoomAndPlayers(roomId);
        }

        return Task.CompletedTask;
    }

    public void StartGameLoop(string roomId)
    {
        StopGameLoop(roomId);

        if (!_rooms.TryGetValue(roomId, out var room) || !room.NeedsGameLoop) return;

        var cancellation = new CancellationTokenSource();
        _gameLoops[roomId] = cancellation;

        _ = Task.Run(() => PumpGameLoopAsync(roomId, cancellation), cancellation.Token);
    }

    public void StopGameLoop(string roomId)
    {
        if (!_gameLoops.TryRemove(roomId, out var cancellation)) return;

        cancellation.Cancel();
        cancellation.Dispose();
    }

    private BaseGameRoom NewRoom(GamesKind gameType, string playerId, string username, BotDifficulty difficulty, bool isPrivate)
    {
        var room = BaseGameRoom.Create(gameType, difficulty);

        room.Player1Id = playerId;
        room.Player1Username = username;
        room.IsPrivate = isPrivate;

        _rooms[room.RoomId] = room;
        _playerRooms[playerId] = room.RoomId;

        return room;
    }

    private static void SeatSecondPlayer(BaseGameRoom room, string playerId, string? username)
    {
        room.Player2Id = playerId;
        room.Player2Username = username;
        room.IsFull = true;
        room.CurrentTurnPlayerId = room.Player1Id;
    }

    private static string? OpponentOf(BaseGameRoom room, string playerId) =>
        playerId == room.Player1Id ? room.Player2Id : room.Player1Id;

    private void ForgetPlayerRoom(string playerId) => _playerRooms.TryRemove(playerId, out _);

    private void ForgetSeatedPlayer(string? playerId)
    {
        if (playerId == null) return;

        _playerRooms.TryRemove(playerId, out _);
        CancelDisconnectGrace(playerId);
    }

    private void CancelPendingInvite(BaseGameRoom room, string roomId)
    {
        if (room.InvitedPlayerId is { } invitedId) _ = eventBus.PublishAsync(new GameInviteCancelledEvent(invitedId, roomId));
    }

    private async Task AcceptPlayAgainAsync(string roomId, BaseGameRoom room)
    {
        room.ResetForNewRound();

        if (room.NeedsGameLoop) StartGameLoop(roomId);

        await hub.Clients.Group(roomId).SendAsync("playAgainResponse", new { accepted = true });
        await hub.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
    }

    private async Task CompleteRoundAsync(BaseGameRoom room, string roomId)
    {
        if (!room.TryMarkRoundResultPersisted()) return;

        StopGameLoop(roomId);
        await PersistResultAsync(room);
    }

    private async Task PersistResultAsync(BaseGameRoom room)
    {
        var first = room.HumanPlayer1Id;
        var second = room.HumanPlayer2Id;

        if (!Guid.TryParse(first, out var firstId) || !Guid.TryParse(second, out var secondId)) return;

        try
        {
            using var scope = scopeFactory.CreateScope();

            await scope.ServiceProvider
                .GetRequiredService<IMatchHistoryService>()
                .SaveMatchHistoryAsync(room.RoomId, room.GameType, firstId, secondId, room.Score[0], room.Score[1]);

            await scope.ServiceProvider
                .GetRequiredService<IEventBus>()
                .PublishAsync(new GameFinishedEvent(first, second, room.Score[0], room.Score[1]));
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Could not save the result for room {RoomId}", room.RoomId);
        }
    }

    private async Task PumpGameLoopAsync(string roomId, CancellationTokenSource cancellation)
    {
        try
        {
            while (!cancellation.Token.IsCancellationRequested)
            {
                await Task.Delay(_rooms.TryGetValue(roomId, out var room) ? room.TickIntervalMs : Constants.DefaultTickMs, cancellation.Token);

                if (!_rooms.TryGetValue(roomId, out var current) || !current.HasStarted) break;

                current.Tick();
                await hub.Clients.Group(roomId).SendAsync("gameState", current.GetStatePayload());

                if (current.WinnerPlayerId == null) continue;

                await CompleteRoundAsync(current, roomId);
                break;
            }
        }
        catch (OperationCanceledException) { }
        finally
        {
            _gameLoops.TryRemove(roomId, out _);
        }
    }

    private async Task RunBotMoveAsync(BaseGameRoom room, string roomId)
    {
        try
        {
            await Task.Delay(room.BotMoveDelayMs + Random.Shared.Next(0, 400));

            if (!_rooms.ContainsKey(roomId)) return;

            room.MakeBotMove();
            await hub.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());

            if (room.WinnerPlayerId != null) await CompleteRoundAsync(room, roomId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Bot move failed in room {RoomId}", roomId);
        }
    }

    private void ScheduleDisconnectGrace(string playerId)
    {
        CancelDisconnectGrace(playerId);

        var cancellation = new CancellationTokenSource();
        _disconnectGraces[playerId] = cancellation;

        _ = WaitOutGraceThenLeaveAsync(playerId, cancellation);
    }

    private async Task WaitOutGraceThenLeaveAsync(string playerId, CancellationTokenSource cancellation)
    {
        try
        {
            await Task.Delay(ReconnectGrace, cancellation.Token);
            if (_playerConnections.ContainsKey(playerId)
                || !_disconnectGraces.TryGetValue(playerId, out var scheduled)
                || scheduled != cancellation) return;

            _disconnectGraces.TryRemove(playerId, out _);
            await LeaveGameAsync(playerId);
        }
        catch (OperationCanceledException) { }
        finally
        {
            cancellation.Dispose();
        }
    }

    private void CancelDisconnectGrace(string playerId)
    {
        if (_disconnectGraces.TryRemove(playerId, out var cancellation)) cancellation.Cancel();
    }

    private async Task HandleDepartureAsync(BaseGameRoom room, string roomId, string playerId)
    {
        if (room.WinnerPlayerId != null)
        {
            await FinishAndClearAsync(room, roomId);
            return;
        }

        if (!room.HasStarted)
        {
            RemoveLobbyPlayer(room, roomId, playerId);
            await hub.Clients.Group(roomId).SendAsync("OpponentDisconnected");

            if (_rooms.ContainsKey(roomId)) await hub.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());

            return;
        }

        if (room.IsBotGame)
        {
            room.OnPlayerDisconnected(playerId);
            room.IsFinished = true;
            await CompleteRoundAsync(room, roomId);
            await FinishAndClearAsync(room, roomId);
            return;
        }

        room.ReplacePlayerWithBot(playerId);
        _playerRooms.TryRemove(playerId, out _);
        room.MakeBotMove();

        await eventBus.PublishAsync(new GameLeftEvent(playerId));
        await hub.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
    }

    private async Task FinishAndClearAsync(BaseGameRoom room, string roomId)
    {
        room.IsFinished = true;
        RemoveRoomAndPlayers(roomId);
        await hub.Clients.Group(roomId).SendAsync("OpponentDisconnected");
    }

    private void RemoveLobbyPlayer(BaseGameRoom room, string roomId, string playerId)
    {
        _playerRooms.TryRemove(playerId, out _);

        if (room.Player1Id == playerId)
        {
            if (room.Player2Id is { } player2Id && player2Id != Constants.BotPlayerId) PromoteToFirstSeat(room, roomId, player2Id);
            else RemoveRoomAndPlayers(roomId);

            return;
        }

        if (room.Player2Id == playerId)
        {
            CancelPendingInvite(room, roomId);
            room.Player2Id = null;
            room.Player2Username = null;
            room.IsFull = false;
            room.InvitedPlayerId = null;
        }
    }

    private void PromoteToFirstSeat(BaseGameRoom room, string roomId, string player2Id)
    {
        CancelPendingInvite(room, roomId);

        room.Player1Id = player2Id;
        room.Player1Username = room.Player2Username;
        room.Player2Id = null;
        room.Player2Username = null;
        room.IsFull = false;
        room.InvitedPlayerId = null;

        _playerRooms[player2Id] = roomId;
    }
}
