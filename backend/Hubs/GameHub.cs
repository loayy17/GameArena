using backend.Domain;
using backend.Enums;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Abstractions;
using System.Collections.Concurrent;

namespace ChatWebSignalR.Hubs
{
    [Authorize]
    public class GameHub(IGameService _gameService, IHubContext<ChatHub> _chatHubContext) : Hub
    {
        private static readonly Lock _matchLock = new();
        public static readonly ConcurrentDictionary<string, BaseGameRoom> Rooms = new();
        public static readonly ConcurrentDictionary<string, string> PlayerToRoom = new();

        public async Task FindMatch(GamesKind gameType)
        {
            string playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);

            BaseGameRoom? room = null;

            lock (_matchLock)
            {
                var openRoom = Rooms.Values.FirstOrDefault(r =>r.GameType == gameType && !r.IsFull && r.Player1Id != playerId);

                if (openRoom != null)
                {
                    openRoom.Player2Id = playerId;
                    openRoom.Player2Username = Context.User?.Identity?.Name ?? "Player 2";
                    openRoom.IsFull = true;

                    if (openRoom is TicTacTaoRoom xo)
                        xo.CurrentTurnPlayerId = openRoom.Player1Id!;

                    room = openRoom;
                }
                else
                {
                    room = gameType switch
                    {
                        GamesKind.TicTacToe => new TicTacTaoRoom(),
                        _ => throw new AppException(ErrorCode.InvalidGameType)
                    };

                    room.Player1Id = playerId;
                    room.Player1Username = Context.User?.Identity?.Name ?? "Player 1";
                    Rooms[room.RoomId] = room;
                }

                PlayerToRoom[playerId] = room.RoomId;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);

            await Clients.Group(room.RoomId)
                .SendAsync("gameState", room.GetStatePayload());
        }

        public async Task SendAction(string inputType, string payload)
        {
            var playerId = Context.UserIdentifier;

            if (playerId == null) return;

            if (!PlayerToRoom.TryGetValue(playerId, out var roomId))
                return;

            if (!Rooms.TryGetValue(roomId, out var room))
                return;

            if (room.IsFinished)
                return;

            if (room.Player1Id != playerId && room.Player2Id != playerId)
                return;

            if (room is TicTacTaoRoom xoRoom &&
                xoRoom.CurrentTurnPlayerId != playerId)
                return;

            room.ProcessInput(playerId, inputType, payload);

            await Clients.Group(roomId)
                        .SendAsync("gameState", room.GetStatePayload());

            if (room is TicTacTaoRoom game && game.IsFinished)
            {
                await _gameService.SaveMatchHistoryAsync(game);

                Rooms.TryRemove(roomId, out _);

                if (game.Player1Id != null)
                    PlayerToRoom.TryRemove(game.Player1Id, out _);

                if (game.Player2Id != null)
                    PlayerToRoom.TryRemove(game.Player2Id, out _);
            }
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var playerId = Context.UserIdentifier;

            if (playerId != null &&
                PlayerToRoom.TryRemove(playerId, out var roomId))
            {
                if (Rooms.TryGetValue(roomId, out var room))
                {
                    Rooms.TryRemove(roomId, out _);

                    var opponentId = room.Player1Id == playerId ? room.Player2Id : room.Player1Id;
                    if (opponentId != null)
                    {
                        PlayerToRoom.TryRemove(opponentId, out _);
                    }

                    if (!room.IsFinished && room.IsFull)
                    {
                        room.IsFinished = true;
                        if (room is TicTacTaoRoom xoRoom)
                        {
                            xoRoom.WinnerPlayerId = opponentId;
                            xoRoom.WinnerSymbol = opponentId == xoRoom.Player1Id ? "X" : "O";
                            await _gameService.SaveMatchHistoryAsync(xoRoom);
                        }
                    }

                    await Clients.Group(roomId)
                        .SendAsync("OpponentDisconnected");
                }
            }

            await base.OnDisconnectedAsync(exception);
        }
        public async Task CancelSearch()
        {
            string playerId = Context.UserIdentifier
                ?? throw new HubException("Unauthorized user");

            if (PlayerToRoom.TryGetValue(playerId, out var roomId) &&
                Rooms.TryGetValue(roomId, out var room))
            {
                if (!room.IsFull)
                {
                    Rooms.TryRemove(roomId, out _);
                    PlayerToRoom.TryRemove(playerId, out _);
                    await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
                }
            }
        }
        // Invite a friend to a private game
        public async Task InviteFriend(string friendId, GamesKind gameType)
        {
            string playerId = Context.UserIdentifier!;
            string username = Context.User?.Identity?.Name ?? "Player";

            var room = gameType switch
            {
                GamesKind.TicTacToe => new TicTacTaoRoom
                {
                    Player1Id = playerId,
                    Player1Username = username,
                    RoomId = Guid.NewGuid().ToString("N")
                },
                _ => throw new AppException(ErrorCode.InvalidGameType)
            };

            Rooms[room.RoomId] = room;
            PlayerToRoom[playerId] = room.RoomId;
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            await Clients.Group(room.RoomId).SendAsync("gameState", room.GetStatePayload());
            await _chatHubContext.Clients.User(friendId).SendAsync("GameInvite", new
            {
                roomId = room.RoomId,
                gameType,
                inviterId = playerId,
                inviterName = username
            });
        }

        public async Task AcceptInvite(string roomId)
        {
            if(roomId == null) throw new AppException(ErrorCode.InvalidRoomId);
            var playerId = Context.UserIdentifier ?? throw new AppException(ErrorCode.Unauthorized);
            var username = Context.User?.Identity?.Name ;

            if (Rooms.TryGetValue(roomId, out var room) && !room.IsFull && room.Player1Id != playerId)
            {
                room.Player2Id = playerId;
                room.Player2Username = username;
                room.IsFull = true;
                if (room.Player1Id != null && room is TicTacTaoRoom xo) xo.CurrentTurnPlayerId = room.Player1Id;
                PlayerToRoom[playerId] = roomId;
                await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
                await Clients.Group(roomId).SendAsync("gameState", room.GetStatePayload());
            }
        }
    }
}