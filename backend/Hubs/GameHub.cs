using System.Text.Json;
using backend.Domain;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    [Authorize]
    public class GameHub(
        IGameRoomService _roomService,
        IMatchHistoryService _matchHistoryService,
        IEventBus _eventBus) : Hub
    {
        private string GetPlayerId() =>
            Context.UserIdentifier ?? throw new HubException("Unauthorized");

        private bool TryGetPlayerRoom(string playerId, out BaseGameRoom? room, out string? roomId)
        {
            room = null;
            roomId = null;
            return _roomService.TryGetPlayerRoom(playerId, out roomId)
                && roomId != null
                && _roomService.TryGetRoom(roomId, out room)
                && room != null;
        }

        private async Task FinishGameAndSave(BaseGameRoom room, string? roomId)
        {
            _roomService.StopGameLoop(roomId!);
            await _eventBus.PublishAsync(new GameFinishedEvent(room.Player1Id!, room.Player2Id!));
            await _matchHistoryService.SaveMatchHistoryAsync(room);
            _roomService.RemoveRoomAndPlayers(roomId!);
        }

        private async Task ReplaceWithBot(BaseGameRoom room, string playerId)
        {
            room.IsBotGame = true;
            if (room.Player1Id == playerId)
                room.Player1Username = "AI Bot";
            else
                room.Player2Username = "AI Bot";

            if (room is TicTacToeRoom xo && room.CurrentTurnPlayerId == playerId)
            {
                var botSymbol = room.Player1Id == playerId ? "X" : "O";
                var botMove = TicTacToeMinimax.GetBestMove(xo.Board, botSymbol);
                if (botMove >= 0)
                    room.ProcessInput(playerId, new { type = "MAKE_MOVE", cell = botMove });
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var playerId = Context.UserIdentifier;
            if (playerId == null) return;

            if (TryGetPlayerRoom(playerId, out var room, out var roomId))
            {
                room!.DisconnectedPlayerId = playerId;

                if (room.IsFinished)
                {
                    _roomService.RemoveRoomAndPlayers(roomId!);
                    return;
                }

                if (!room.HasStarted)
                {
                    if (room.IsFull)
                    {
                        _roomService.TryRemovePlayer(playerId);
                        await Clients.Group(roomId!).SendAsync("OpponentDisconnected");
                    }
                    else
                    {
                        _roomService.RemoveRoomAndPlayers(roomId!);
                    }
                    return;
                }

                if (room.IsBotGame)
                {
                    room.IsFinished = true;
                    room.WinnerPlayerId = room.Player1Id == playerId ? room.Player2Id : room.Player1Id;
                    if (room is TicTacToeRoom xoRoom)
                        xoRoom.WinnerSymbol = room.WinnerPlayerId == xoRoom.Player1Id ? "X" : "O";
                    await FinishGameAndSave(room, roomId);
                    await Clients.Group(roomId!).SendAsync("OpponentDisconnected");
                    return;
                }

                await ReplaceWithBot(room, playerId);
                await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task FindMatch(GamesKind gameType)
        {
            try
            {
                var playerId = GetPlayerId();

                if (TryGetPlayerRoom(playerId, out var existingRoom, out var existingRoomId)
                    && !existingRoom!.IsFinished)
                {
                    existingRoom.DisconnectedPlayerId = null;
                    await Groups.AddToGroupAsync(Context.ConnectionId, existingRoomId!);
                    await Clients.Caller.SendAsync("gameState", existingRoom.GetStatePayload());
                    return;
                }

                var username = Context.User?.Identity?.Name ?? "Player 1";
                var (room, _) = _roomService.FindOrCreateRoom(gameType, playerId, username);

                await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
                await Clients.Group(room.RoomId)
                    .SendAsync("gameState", room.GetStatePayload());
            }
            catch (AppException ex)
            {
                throw new HubException(ex.Message);
            }
        }

        public async Task SendAction(JsonElement action)
        {
            var playerId = GetPlayerId();

            if (!TryGetPlayerRoom(playerId, out var room, out var roomId)
                || room!.IsFinished
                || (room.Player1Id != playerId && room.Player2Id != playerId))
                return;

            room.ProcessInput(playerId, action);

            if (!room.IsFinished && room.IsBotGame && room is TicTacToeRoom xoRoom)
            {
                var botId = room.Player1Id == playerId ? room.Player2Id! : room.Player1Id!;
                var botSymbol = botId == xoRoom.Player1Id ? "X" : "O";
                var botMove = TicTacToeMinimax.GetBestMove(xoRoom.Board, botSymbol);
                if (botMove >= 0)
                    room.ProcessInput(botId, new { type = "MAKE_MOVE", cell = botMove });
            }

            await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());

            if (room.IsFinished)
                await FinishGameAndSave(room, roomId);
        }

        public async Task StartGame(string? friendId, GamesKind gameKind)
        {
            var playerId = GetPlayerId();
            if (!TryGetPlayerRoom(playerId, out var room, out var roomId)
                || room!.GameType != gameKind
                || room.Player1Id != playerId
                || room.HasStarted)
                return;

            if (room.Player2Id == null)
            {
                room.Player2Id = "__BOT__";
                room.Player2Username = "AI Bot";
                room.IsFull = true;
                room.IsBotGame = true;
            }
            else if (friendId != null && room.Player2Id != friendId)
            {
                return;
            }

            room.HasStarted = true;
            room.CurrentTurnPlayerId = room.Player1Id!;

            await _eventBus.PublishAsync(new GameStartedEvent(playerId, room.Player2Id!));
            await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());

            if (room is PingPongRoom)
            {
                _roomService.StartGameLoop(roomId!);
            }
        }

        public async Task LeaveGame()
        {
            var playerId = GetPlayerId();

            if (!TryGetPlayerRoom(playerId, out var room, out var roomId) || room!.IsFinished)
                return;

            if (!room.HasStarted || room.Player2Id == null)
            {
                _roomService.RemoveRoomAndPlayers(roomId!);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);
                return;
            }

            _roomService.TryRemovePlayer(playerId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);

            if (room.IsBotGame)
            {
                room.IsFinished = true;
                room.WinnerPlayerId = room.Player1Id == playerId ? room.Player2Id : room.Player1Id;
                if (room is TicTacToeRoom xo)
                    xo.WinnerSymbol = room.WinnerPlayerId == xo.Player1Id ? "X" : "O";
                await FinishGameAndSave(room, roomId);
            }
            else
            {
                await ReplaceWithBot(room, playerId);
                await _eventBus.PublishAsync(new GameLeftEvent(playerId));
            }

            await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());
        }

        public async Task InviteToRoom(string friendId)
        {
            var playerId = GetPlayerId();

            if (!TryGetPlayerRoom(playerId, out var room, out var roomId)
                || room!.IsFinished || room.IsFull)
                return;

            room.InvitedPlayerId = friendId;

            var username = Context.User?.Identity?.Name ?? "Player";
            await Clients.User(friendId).SendAsync("game:invite", new
            {
                roomId = room.RoomId,
                gameType = (int)room.GameType,
                inviterId = playerId,
                inviterName = username
            });
        }

        public Task<object?> GetCurrentState()
        {
            var playerId = GetPlayerId();

            if (TryGetPlayerRoom(playerId, out var room, out _))
                return Task.FromResult<object?>(room!.GetStatePayload());

            return Task.FromResult<object?>(null);
        }

        public async Task CancelSearch()
        {
            var playerId = GetPlayerId();

            if (TryGetPlayerRoom(playerId, out var room, out var roomId) && !room!.IsFull)
            {
                _roomService.TryRemoveRoom(roomId!);
                _roomService.TryRemovePlayer(playerId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);
            }
        }

        public async Task InviteFriend(string friendId, GamesKind gameType)
        {
            var playerId = GetPlayerId();
            string username = Context.User?.Identity?.Name ?? "Player";

            if (TryGetPlayerRoom(playerId, out var existingRoom, out var existingRoomId)
                && !existingRoom!.IsFinished)
            {
                existingRoom.DisconnectedPlayerId = null;
                await Groups.AddToGroupAsync(Context.ConnectionId, existingRoomId!);
                await Clients.Caller.SendAsync("gameState", existingRoom.GetStatePayload());
                return;
            }

            var room = _roomService.CreatePrivateRoom(gameType, playerId, username, friendId);

            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            await Clients.Group(room.RoomId).SendAsync("gameState", room.GetStatePayload());
            await Clients.User(friendId).SendAsync("game:invite", new
            {
                roomId = room.RoomId,
                gameType = (int)gameType,
                inviterId = playerId,
                inviterName = username
            });
        }

        public async Task AcceptInvite(string roomId)
        {
            var playerId = GetPlayerId();
            if (string.IsNullOrEmpty(roomId)) throw new AppException(ErrorCode.InvalidRoomId);
            var username = Context.User?.Identity?.Name;

            if (_roomService.TryJoinRoom(roomId, playerId, username))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                if (_roomService.TryGetRoom(roomId, out var room))
                    await Clients.Group(roomId).SendAsync("gameState", room!.GetStatePayload());
            }
        }
    }
}
