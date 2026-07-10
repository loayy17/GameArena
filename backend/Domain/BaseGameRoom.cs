using backend.Enums;

namespace backend.Domain
{
    public abstract class BaseGameRoom(GamesKind _gameType)
    {
        public string RoomId { get; set; } = Guid.NewGuid().ToString();
        public GamesKind GameType { get; } = _gameType;
        public string? Player1Id { get; set; }
        public string? Player1Username { get; set; }
        public string? Player2Id { get; set; }
        public string? Player2Username { get; set; }
        public bool IsFull { get; set; } = false;
        public bool IsFinished { get; set; } = false;
        public bool IsPrivate { get; set; } = false;
        public string? InvitedPlayerId { get; set; }
        public bool HasStarted { get; set; } = false;
        public string? WinnerPlayerId { get; set; }
        public string? WinnerSymbol { get; set; }
        public string? DisconnectedPlayerId { get; set; }
        public bool IsBotGame { get; set; } = false;
        public abstract object GetStatePayload();
        public abstract void ProcessInput(string playerId, object action);
    }

}
