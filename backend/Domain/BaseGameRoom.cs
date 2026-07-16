using System.Text.Json;
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
        public string? CurrentTurnPlayerId { get; set; }
        public int[] Score { get; set; } = [0, 0];

        public abstract object GetStatePayload();

        public abstract void HandleAction(string playerId, JsonElement action);

        public virtual void ResetForNewRound()
        {
            WinnerPlayerId = null;
            WinnerSymbol = null;
            IsFinished = false;
            HasStarted = true;
            CurrentTurnPlayerId = Player1Id;
        }

        public virtual bool NeedsGameLoop => false;

        public virtual int TickIntervalMs => 50;

        public virtual void Tick() { }

        public virtual void MakeBotMove() { }

        public virtual void ReplacePlayerWithBot(string playerId)
        {
            IsBotGame = true;
            if (Player1Id == playerId)
            {
                Player1Id = "__BOT__";
                Player1Username = "AI Bot";
            }
            else
            {
                Player2Id = "__BOT__";
                Player2Username = "AI Bot";
            }
        }

        public virtual void OnPlayerDisconnected(string disconnectedPlayerId)
        {
            WinnerPlayerId = disconnectedPlayerId == Player1Id ? Player2Id : Player1Id;
        }
    }
}
