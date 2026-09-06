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
        IEventBus _eventBus,
        INotificationService _notificationService,
        ILogger<GameHub> _logger) : Hub
    {
        private string GetPlayerId() =>
            Context.UserIdentifier ?? throw new HubException("Unauthorized");

        private string GetUsername() =>
            Context.User?.Identity?.Name ?? "Player";

        private bool TryGetPlayerRoom(string playerId, out BaseGameRoom? room, out string? roomId)
        {
            room = null;
            roomId = null;
            return _roomService.TryGetPlayerRoom(playerId, out roomId)
                && roomId != null
                && _roomService.TryGetRoom(roomId, out room)
                && room != null;
        }

        public override async Task OnConnectedAsync()
        {
            var playerId = Context.UserIdentifier;
            if (playerId == null)
            {
                await base.OnConnectedAsync();
                return;
            }

            _roomService.RegisterConnection(playerId, Context.ConnectionId);
            if (TryGetPlayerRoom(playerId, out var room, out var roomId))
            {
                if (room!.WinnerPlayerId != null)
                   await _roomService.LeaveGameAsync(playerId);
                else
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, roomId!);
                    await Clients.Caller.SendAsync("gameState", room!.GetStatePayload());
                }
            }

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (exception != null)
                _logger.LogWarning(exception, "GameHub connection disconnected with error for user {UserId}", Context.UserIdentifier);

            if (Context.UserIdentifier is { } playerId)
                await _roomService.UnregisterConnectionAsync(playerId, Context.ConnectionId);

            await base.OnDisconnectedAsync(exception);
        }

        public async Task FindMatch(GamesKind gameType)
        {
            try
            {
                var playerId = GetPlayerId();

                if (TryGetPlayerRoom(playerId, out var existingRoom, out var existingRoomId))
                {
                    if (existingRoom!.GameType == gameType && existingRoom.WinnerPlayerId == null)
                    {
                        await Groups.AddToGroupAsync(Context.ConnectionId, existingRoomId!);
                        await Clients.Caller.SendAsync("gameState", existingRoom!.GetStatePayload());
                        return;
                    }

                    await _roomService.LeaveGameAsync(playerId);
                }

                var username = GetUsername();
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

        public async Task RequestPlayAgain()
        {
            var playerId = GetPlayerId();
            if (!TryGetPlayerRoom(playerId, out var room, out var roomId) || room == null)
                return;

            await _roomService.RequestPlayAgainAsync(roomId!, playerId);
        }

        public async Task RespondPlayAgain(bool accept)
        {
            var playerId = GetPlayerId();
            if (!TryGetPlayerRoom(playerId, out var room, out var roomId) || room == null)
                return;

            await _roomService.RespondPlayAgainAsync(roomId!, playerId, accept);
        }

        public async Task SendAction(JsonElement action)
        {
            var playerId = GetPlayerId();

            if (!TryGetPlayerRoom(playerId, out var room, out var roomId)
                || room!.IsFinished
                || (room.WinnerPlayerId != null)
                || !room.HasStarted
                || (room.Player1Id != playerId && room.Player2Id != playerId))
                return;

            try
            {
                await _roomService.ProcessActionAsync(roomId!, playerId, action);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing game action for player {PlayerId}", playerId);
                throw new HubException("Failed to process game action");
            }
        }

        public async Task StartGame(string? friendId, GamesKind gameKind)
        {
            var playerId = GetPlayerId();
            if (!TryGetPlayerRoom(playerId, out var room, out var roomId)
                || room!.GameType != gameKind)
                return;

            var started = await _roomService.StartGameAsync(roomId!, playerId, friendId);
            if (!started) return;

            await Clients.Group(roomId!).SendAsync("gameState", room.GetStatePayload());
        }

        public async Task LeaveGame()
        {
            var playerId = GetPlayerId();

            if (!TryGetPlayerRoom(playerId, out _, out var roomId))
                return;

            await _roomService.LeaveGameAsync(playerId);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);
        }

        public async Task InviteToRoom(string friendId)
        {
            var playerId = GetPlayerId();

            if (!TryGetPlayerRoom(playerId, out var room, out var roomId)
                || room!.IsFinished || room.IsFull)
                return;

            room.InvitedPlayerId = friendId;

            var username = GetUsername();
            await Clients.User(friendId).SendAsync("game:invite", new
            {
                roomId = room.RoomId,
                gameType = (int)room.GameType,
                inviterId = playerId,
                inviterName = username
            });
        }

        public async Task CancelSearch()
        {
            var playerId = GetPlayerId();

            if (TryGetPlayerRoom(playerId, out var room, out var roomId) && !room!.IsFull)
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId!);

            await _roomService.CancelSearchAsync(playerId);
        }

        public async Task CreateLobby(GamesKind gameType)
        {
            var playerId = GetPlayerId();
            var username = GetUsername();

            if (TryGetPlayerRoom(playerId, out _, out _))
                await _roomService.LeaveGameAsync(playerId);

            var room = _roomService.CreatePrivateRoom(gameType, playerId, username, null);
            await Groups.AddToGroupAsync(Context.ConnectionId, room.RoomId);
            await Clients.Caller.SendAsync("gameState", room.GetStatePayload());
        }

        public async Task InviteFriend(string friendId, GamesKind gameType)
        {
            var playerId = GetPlayerId();
            var username = GetUsername();

            if (TryGetPlayerRoom(playerId, out var existingRoom, out var existingRoomId))
            {
                if (existingRoom!.GameType == gameType && existingRoom.WinnerPlayerId == null)
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, existingRoomId!);
                    await Clients.Caller.SendAsync("gameState", existingRoom!.GetStatePayload());
                    return;
                }

                await _roomService.LeaveGameAsync(playerId);
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
            await _eventBus.PublishAsync(new GameInviteSentEvent(friendId, room.RoomId, playerId, username, gameType));
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

                if (Guid.TryParse(playerId, out var joinerId))
                    await _notificationService.DeleteNotificationsByReferenceAsync(joinerId, NotificationType.GameInvite, roomId);
            }
        }
    }
}
