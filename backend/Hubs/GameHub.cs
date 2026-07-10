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
        IGameService _gameService,
        IGameBotService _botService,
        IEventBus _eventBus) : Hub
    {
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var playerId = Context.UserIdentifier;
            if (playerId == null) return;

            if (_roomService.TryGetPlayerRoom(playerId, out var roomId) && _roomService.TryGetRoom(roomId!, out var room))
            {
                room!.DisconnectedPlayerId = playerId;

                if (room.IsFinished)
                {
                    _roomService.RemoveRoomAndPlayers(roomId!);
                    return;
                }

                if (!room.HasStarted)
                {
                    _roomService.RemoveRoomAndPlayers(roomId!);
                    if (room.IsFull) await Clients.Group(roomId!).SendAsync("OpponentDisconnected");
                    return;
                }

                if (room.IsBotGame)
                {
                    room.IsFinished = true;
                    room.WinnerPlayerId = room.Player1Id == playerId ? room.Player2Id : room.Player1Id;
                    if (room is TicTacToeRoom xoRoom)
                        xoRoom.WinnerSymbol = room.WinnerPlayerId == xoRoom.Player1Id ? "X" : "O";
                    await _eventBus.PublishAsync(new GameFinishedEvent(room.Player1Id!, room.Player2Id!));
                    await _gameService.SaveMatchHistoryAsync(room);
                    _roomService.RemoveRoomAndPlayers(roomId!);
                    await Clients.Group(roomId!).SendAsync("OpponentDisconnected");
                    return;
                }

                room.IsBotGame = true;
                if (room.Player1Id == playerId)
                    room.Player1Username = "AI Bot";
                else
                    room.Player2Username = "AI Bot";

                if (room is TicTacToeRoom xo && xo.CurrentTurnPlayerId == playerId)
                {
                    var botSymbol = xo.Player1Id == playerId ? "X" : "O";
                    var botMove = _botService.GetBotMove(xo.Board, botSymbol);
                    if (botMove >= 0)
                        room.ProcessInput(playerId, new { type = "MAKE_MOVE", cell = botMove });
                }

                await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task FindMatch(GamesKind gameType)
        {
            try
            {
                string playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

                if (_roomService.TryGetPlayerRoom(playerId, out var existingRoomId)
                    && _roomService.TryGetRoom(existingRoomId!, out var existingRoom)
                    && !existingRoom!.IsFinished
                )
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
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if (!_roomService.TryGetPlayerRoom(playerId, out var roomId)
                || !_roomService.TryGetRoom(roomId!, out var room)
                || room!.IsFinished
                || (room.Player1Id != playerId && room.Player2Id != playerId)
            )
                return;

            room.ProcessInput(playerId, action);

            if (!room.IsFinished && room.IsBotGame && room is TicTacToeRoom xoRoom)
            {
                var botId = room.Player1Id == playerId ? room.Player2Id! : room.Player1Id!;
                var botSymbol = botId == xoRoom.Player1Id ? "X" : "O";
                var botMove = _botService.GetBotMove(xoRoom.Board, botSymbol);
                if (botMove >= 0)
                {
                    room.ProcessInput(botId, new { type = "MAKE_MOVE", cell = botMove });
                }
            }

            await Clients.Group(roomId!)
                .SendAsync("gameState", room.GetStatePayload());

            if (room.IsFinished)
            {
                await _eventBus.PublishAsync(new GameFinishedEvent(room.Player1Id!, room.Player2Id!));
                await _gameService.SaveMatchHistoryAsync(room);
                _roomService.RemoveRoomAndPlayers(roomId!);
            }
        }

        public async Task StartGame(string? friendId, GamesKind gameKind)
        {
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            if (!_roomService.TryGetPlayerRoom(playerId, out var roomId)
                || !_roomService.TryGetRoom(roomId!, out var room)
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
            if (room is TicTacToeRoom xo)
                xo.CurrentTurnPlayerId = room.Player1Id!;

            await _eventBus.PublishAsync(new GameStartedEvent(playerId, room.Player2Id!));

            await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());
        }

        public async Task LeaveGame()
        {
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if (!_roomService.TryGetPlayerRoom(playerId, out var roomId)
                || !_roomService.TryGetRoom(roomId!, out var room)
                || room!.IsFinished)
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
                await _eventBus.PublishAsync(new GameFinishedEvent(room.Player1Id!, room.Player2Id!));
                await _gameService.SaveMatchHistoryAsync(room);
                _roomService.RemoveRoomAndPlayers(roomId!);
            }
            else
            {
                room.IsBotGame = true;
                if (room.Player1Id == playerId)
                    room.Player1Username = "AI Bot";
                else
                    room.Player2Username = "AI Bot";
                if (room is TicTacToeRoom xo && xo.CurrentTurnPlayerId == playerId)
                {
                    var botSymbol = xo.Player1Id == playerId ? "X" : "O";
                    var botMove = _botService.GetBotMove(xo.Board, botSymbol);
                    if (botMove >= 0)
                        room.ProcessInput(playerId, new { type = "MAKE_MOVE", cell = botMove });
                }

                await _eventBus.PublishAsync(new GameLeftEvent(playerId));
            }

            await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());
        }

        public async Task InviteToRoom(string friendId)
        {
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if (!_roomService.TryGetPlayerRoom(playerId, out var roomId)
                || !_roomService.TryGetRoom(roomId!, out var room)
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
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if (_roomService.TryGetPlayerRoom(playerId, out var roomId)
                && _roomService.TryGetRoom(roomId!, out var room))
            {
                return Task.FromResult<object?>(room!.GetStatePayload());
            }

            return Task.FromResult<object?>(null);
        }

        public async Task CancelSearch()
        {
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            if (_roomService.TryGetPlayerRoom(playerId, out var roomId) &&
                _roomService.TryGetRoom(roomId!, out var room))
            {
                if (!room!.IsFull)
                {
                    _roomService.TryRemoveRoom(roomId!);
                    _roomService.TryRemovePlayer(playerId);
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);
                }
            }
        }

        public async Task InviteFriend(string friendId, GamesKind gameType)
        {
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            string username = Context.User?.Identity?.Name ?? "Player";

            if (_roomService.TryGetPlayerRoom(playerId, out var existingRoomId)
                && _roomService.TryGetRoom(existingRoomId!, out var existingRoom)
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
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            if (string.IsNullOrEmpty(roomId)) throw new AppException(ErrorCode.InvalidRoomId);
            var username = Context.User?.Identity?.Name;

            if (_roomService.TryJoinRoom(roomId, playerId, username))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                if (_roomService.TryGetRoom(roomId, out var room))
                {
                    await Clients.Group(roomId).SendAsync("gameState", room!.GetStatePayload());
                }
            }
        }
    }
}
