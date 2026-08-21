using System.Text.Json;
using backend.Domain;
using backend.Enums;
using backend.Events;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;

namespace backend.Services
{
    public class GameRoomService : IGameRoomService
    {
        private readonly ConcurrentDictionary<string, BaseGameRoom> _rooms = new();
        private readonly ConcurrentDictionary<string, string> _playerToRoom = new();
        private readonly Lock _matchLock = new();
        private readonly ConcurrentDictionary<string, CancellationTokenSource> _gameLoops = new();
        private readonly ConcurrentDictionary<string, string> _playAgainRequests = new();
        private readonly ConcurrentDictionary<string, ConcurrentDictionary<string, byte>> _playerConnections = new();
        private readonly ConcurrentDictionary<string, CancellationTokenSource> _disconnectGracePeriods = new();
        internal static TimeSpan ReconnectGracePeriod { get; set; } = TimeSpan.FromSeconds(30);
        private readonly IHubContext<GameHub> _hubContext;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IEventBus _eventBus;
        private readonly ILogger<GameRoomService> _logger;

        public GameRoomService(IHubContext<GameHub> hubContext, IServiceScopeFactory scopeFactory, IEventBus eventBus, ILogger<GameRoomService> logger)
        {
            _hubContext = hubContext;
            _scopeFactory = scopeFactory;
            _eventBus = eventBus;
            _logger = logger;
        }

        public (BaseGameRoom room, bool isNew) FindOrCreateRoom(GamesKind gameType, string playerId, string username)
        {
            _playerToRoom.TryRemove(playerId, out _);
            lock (_matchLock)
            {
                var openRoom = _rooms.Values.FirstOrDefault(r =>
                    r.GameType == gameType && !r.IsFull && !r.IsPrivate && r.Player1Id != playerId);

                if (openRoom != null)
                {
                    openRoom.Player2Id = playerId;
                    openRoom.Player2Username = username;
                    openRoom.IsFull = true;
                    openRoom.CurrentTurnPlayerId = openRoom.Player1Id!;
                    _playerToRoom[playerId] = openRoom.RoomId;
                    return (openRoom, false);
                }

                BaseGameRoom room = BaseGameRoom.Create(gameType);
                room.Player1Id = playerId;
                room.Player1Username = username;
                _rooms[room.RoomId] = room;
                _playerToRoom[playerId] = room.RoomId;
                return (room, true);
            }
        }

        public BaseGameRoom CreatePrivateRoom(GamesKind gameType, string playerId, string username, string? invitedPlayerId)
        {
            _playerToRoom.TryRemove(playerId, out _);
            lock (_matchLock)
            {
                var room = BaseGameRoom.Create(gameType);
                room.Player1Id = playerId;
                room.Player1Username = username;
                room.IsPrivate = true;
                room.InvitedPlayerId = invitedPlayerId;
                _rooms[room.RoomId] = room;
                _playerToRoom[playerId] = room.RoomId;
                return room;
            }
        }

        public bool TryGetRoom(string roomId, out BaseGameRoom? room)
            => _rooms.TryGetValue(roomId, out room);

        public bool TryRemoveRoom(string roomId)
            => _rooms.TryRemove(roomId, out _);

        public bool TryGetPlayerRoom(string playerId, out string? roomId)
            => _playerToRoom.TryGetValue(playerId, out roomId);

        public bool TryRemovePlayer(string playerId)
            => _playerToRoom.TryRemove(playerId, out _);

        public bool TryJoinRoom(string roomId, string playerId, string? username)
        {
            _playerToRoom.TryRemove(playerId, out _);
            lock (_matchLock)
            {
                if (_rooms.TryGetValue(roomId, out var room)
                    && !room.IsFull
                    && room.Player1Id != playerId
                    && room.InvitedPlayerId == playerId)
                {
                    room.Player2Id = playerId;
                    room.Player2Username = username;
                    room.IsFull = true;
                    if (room.Player1Id != null)
                        room.CurrentTurnPlayerId = room.Player1Id;
                    _playerToRoom[playerId] = roomId;
                    return true;
                }
                return false;
            }
        }

        public void RemoveRoomAndPlayers(string roomId)
        {
            StopGameLoop(roomId);
            _playAgainRequests.TryRemove(roomId, out _);
            if (_rooms.TryRemove(roomId, out var room))
            {
                if (room.Player1Id != null)
                {
                    _playerToRoom.TryRemove(room.Player1Id, out _);
                    CancelDisconnectGrace(room.Player1Id);
                }
                if (room.Player2Id != null)
                {
                    _playerToRoom.TryRemove(room.Player2Id, out _);
                    CancelDisconnectGrace(room.Player2Id);
                }
            }
        }

        public void RegisterConnection(string playerId, string connectionId)
        {
            var connections = _playerConnections.GetOrAdd(playerId, _ => new ConcurrentDictionary<string, byte>());
            connections[connectionId] = 0;
            CancelDisconnectGrace(playerId);
        }

        public Task UnregisterConnectionAsync(string playerId, string connectionId)
        {
            if (!_playerConnections.TryGetValue(playerId, out var connections))
                return Task.CompletedTask;

            connections.TryRemove(connectionId, out _);
            if (!connections.IsEmpty)
                return Task.CompletedTask;

            _playerConnections.TryRemove(playerId, out _);
            if (!_playerToRoom.ContainsKey(playerId))
                return Task.CompletedTask;

            ScheduleDisconnectGrace(playerId);
            return Task.CompletedTask;
        }

        public async Task ProcessActionAsync(string roomId, string playerId, JsonElement action)
        {
            if (!_rooms.TryGetValue(roomId, out var room)) return;

            try
            {
                room.HandleAction(playerId, action);

                if (room.IsBotGame)
                    room.MakeBotMove();

                await _hubContext.Clients.Group(roomId)
                    .SendAsync("gameState", room.GetStatePayload());

                if (room.WinnerPlayerId != null)
                {
                    await CompleteRoundAsync(room, roomId);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "ProcessActionAsync error");
            }
        }

        public async Task<bool> StartGameAsync(string roomId, string playerId, string? friendId)
        {
            if (!_rooms.TryGetValue(roomId, out var room)
                || room.Player1Id != playerId
                || room.HasStarted)
                return false;

            if (room.Player2Id == null)
            {
                room.Player2Id = "__BOT__";
                room.Player2Username = "AI Bot";
                room.IsFull = true;
                room.IsBotGame = true;
            }
            else if (friendId != null && room.Player2Id != friendId)
            {
                return false;
            }

            room.HasStarted = true;
            room.CurrentTurnPlayerId = room.Player1Id!;
            room.ResetForNewRound();

            await _eventBus.PublishAsync(new GameStartedEvent(room.Player1Id!, room.Player2Id!));
            StartGameLoop(roomId);

            return true;
        }

        public async Task RequestPlayAgainAsync(string roomId, string playerId)
        {
            if (!_rooms.TryGetValue(roomId, out var room) || room.WinnerPlayerId == null)
                return;

            if (room.IsBotGame)
            {
                await AcceptPlayAgainAsync(roomId, room);
                return;
            }

            var otherId = playerId == room.Player1Id ? room.Player2Id : room.Player1Id;
            if (otherId == null) return;

            if (_playAgainRequests.TryGetValue(roomId, out var requester)
                && requester == otherId)
            {
                _playAgainRequests.TryRemove(roomId, out _);
                await AcceptPlayAgainAsync(roomId, room);
                return;
            }

            _playAgainRequests[roomId] = playerId;

            var requesterUsername = playerId == room.Player1Id ? room.Player1Username : room.Player2Username;
            await _hubContext.Clients.User(otherId).SendAsync("playAgainRequest", new
            {
                requesterId = playerId,
                requesterUsername
            });
        }

        public async Task RespondPlayAgainAsync(string roomId, string playerId, bool accept)
        {
            if (!_rooms.TryGetValue(roomId, out var room))
            {
                _playAgainRequests.TryRemove(roomId, out _);
                return;
            }

            _playAgainRequests.TryRemove(roomId, out _);

            if (accept)
                await AcceptPlayAgainAsync(roomId, room);
            else
            {
                room.IsFinished = true;
                await _hubContext.Clients.Group(roomId).SendAsync("playAgainResponse", new { accepted = false });
                RemoveRoomAndPlayers(roomId);
            }
        }

        public async Task LeaveGameAsync(string playerId)
        {
            CancelDisconnectGrace(playerId);
            if (!TryGetPlayerRoom(playerId, out var roomId)
                || roomId == null
                || !_rooms.TryGetValue(roomId, out var room))
                return;

            await HandlePlayerDepartureAsync(room, roomId, playerId);
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

        private async Task CompleteRoundAsync(BaseGameRoom room, string roomId)
        {
            if (!room.TryMarkRoundResultPersisted())
                return;

            StopGameLoop(roomId);
            await PersistMatchResultAsync(room);
        }

        private async Task PersistMatchResultAsync(BaseGameRoom room)
        {
            if (room.IsBotGame) return;
            if (!Guid.TryParse(room.Player1Id, out var _) || !Guid.TryParse(room.Player2Id, out var _)) return;

            try
            {
                using var scope = _scopeFactory.CreateScope();
                var matchHistory = scope.ServiceProvider.GetRequiredService<IMatchHistoryService>();
                await matchHistory.SaveMatchHistoryAsync(room);

                var eventBus = scope.ServiceProvider.GetRequiredService<IEventBus>();
                await eventBus.PublishAsync(new GameFinishedEvent(room.Player1Id!, room.Player2Id!, room.Score?[0] ?? 0, room.Score?[1] ?? 0));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "PersistMatchResultAsync error");
            }
        }

        public void StartGameLoop(string roomId)
        {
            StopGameLoop(roomId);

            if (!_rooms.TryGetValue(roomId, out var room) || !room.NeedsGameLoop)
                return;

            var cts = new CancellationTokenSource();
            _gameLoops[roomId] = cts;
            var interval = room.TickIntervalMs;

            _ = Task.Run(async () =>
            {
                try
                {
                    while (!cts.Token.IsCancellationRequested)
                    {
                        await Task.Delay(interval, cts.Token);

                        if (!_rooms.TryGetValue(roomId, out var currentRoom))
                            break;

                        if (!currentRoom.HasStarted)
                            break;

                        currentRoom.Tick();

                        await _hubContext.Clients.Group(roomId)
                            .SendAsync("gameState", currentRoom.GetStatePayload());

                        if (currentRoom.WinnerPlayerId != null)
                        {
                            await CompleteRoundAsync(currentRoom, roomId);
                            break;
                        }
                    }
                }
                catch (OperationCanceledException) { }
                finally
                {
                    _gameLoops.TryRemove(roomId, out _);
                }
            }, cts.Token);
        }

        public void StopGameLoop(string roomId)
        {
            if (_gameLoops.TryRemove(roomId, out var cts))
            {
                cts.Cancel();
                cts.Dispose();
            }
        }

        private async Task AcceptPlayAgainAsync(string roomId, BaseGameRoom room)
        {
            room.ResetForNewRound();
            if (room.NeedsGameLoop)
                StartGameLoop(roomId);
            await _hubContext.Clients.Group(roomId).SendAsync("playAgainResponse", new { accepted = true });
            await _hubContext.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
        }

        private void ScheduleDisconnectGrace(string playerId)
        {
            CancelDisconnectGrace(playerId);
            var cancellation = new CancellationTokenSource();
            _disconnectGracePeriods[playerId] = cancellation;

            _ = CompleteDisconnectAfterGraceAsync(playerId, cancellation);
        }

        private async Task CompleteDisconnectAfterGraceAsync(string playerId, CancellationTokenSource cancellation)
        {
            try
            {
                await Task.Delay(ReconnectGracePeriod, cancellation.Token);
                if (_playerConnections.ContainsKey(playerId)
                    || !_disconnectGracePeriods.TryGetValue(playerId, out var scheduled)
                    || scheduled != cancellation)
                    return;

                _disconnectGracePeriods.TryRemove(playerId, out _);
                await LeaveGameAsync(playerId);
            }
            catch (OperationCanceledException)
            {
                // A reconnect or explicit leave cancelled the grace period.
            }
            finally
            {
                cancellation.Dispose();
            }
        }

        private void CancelDisconnectGrace(string playerId)
        {
            if (_disconnectGracePeriods.TryRemove(playerId, out var cancellation))
                cancellation.Cancel();
        }

        private async Task HandlePlayerDepartureAsync(BaseGameRoom room, string roomId, string playerId)
        {
            if (room.WinnerPlayerId != null)
            {
                room.IsFinished = true;
                RemoveRoomAndPlayers(roomId);
                await _hubContext.Clients.Group(roomId).SendAsync("OpponentDisconnected");
                return;
            }

            if (!room.HasStarted)
            {
                RemoveLobbyPlayer(room, roomId, playerId);
                await _hubContext.Clients.Group(roomId).SendAsync("OpponentDisconnected");
                if (_rooms.ContainsKey(roomId))
                    await _hubContext.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
                return;
            }

            if (room.IsBotGame)
            {
                room.OnPlayerDisconnected(playerId);
                room.IsFinished = true;
                await CompleteRoundAsync(room, roomId);
                RemoveRoomAndPlayers(roomId);
                await _hubContext.Clients.Group(roomId).SendAsync("OpponentDisconnected");
                return;
            }

            room.ReplacePlayerWithBot(playerId);
            _playerToRoom.TryRemove(playerId, out _);
            room.MakeBotMove();
            await _eventBus.PublishAsync(new GameLeftEvent(playerId));
            await _hubContext.Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
        }

        private void RemoveLobbyPlayer(BaseGameRoom room, string roomId, string playerId)
        {
            _playerToRoom.TryRemove(playerId, out _);

            if (room.Player1Id == playerId)
            {
                if (room.Player2Id is { } player2Id && player2Id != "__BOT__")
                {
                    room.Player1Id = player2Id;
                    room.Player1Username = room.Player2Username;
                    room.Player2Id = null;
                    room.Player2Username = null;
                    room.IsFull = false;
                    room.InvitedPlayerId = null;
                    _playerToRoom[player2Id] = roomId;
                }
                else
                {
                    RemoveRoomAndPlayers(roomId);
                }
                return;
            }

            if (room.Player2Id == playerId)
            {
                room.Player2Id = null;
                room.Player2Username = null;
                room.IsFull = false;
                room.InvitedPlayerId = null;
            }
        }
    }
}
