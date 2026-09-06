using System.Text.Json;
using System.Threading;
using backend.Enums;
using backend.Utils;

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
        public bool IsFull { get; set; }
        public bool IsFinished { get; set; }
        public bool IsPrivate { get; set; }
        public string? InvitedPlayerId { get; set; }
        public bool HasStarted { get; set; }
        public string? WinnerPlayerId { get; set; }
        public string? WinnerSymbol { get; set; }
        public string[] WinningCells { get; protected set; } = [];
        public bool IsBotGame { get; set; }
        public string? CurrentTurnPlayerId { get; set; }
        public int[] Score { get; set; } = [0, 0];
        private int _roundResultPersisted;

        public bool TryMarkRoundResultPersisted() =>
            Interlocked.CompareExchange(ref _roundResultPersisted, 1, 0) == 0;

        public static BaseGameRoom Create(GamesKind gameType)
        {
            return gameType switch
            {
                GamesKind.TicTacToe => new TicTacToeRoom(),
                GamesKind.PingPong => new PingPongRoom(),
                GamesKind.Snake => new SnakeRoom(),
                GamesKind.RockPaperScissors => new RockPaperScissors(),
                GamesKind.ConnectFour => new ConnectFourRoom(),
                _ => throw new AppException(ErrorCode.InvalidGameType)
            };
        }

        public abstract object GetStatePayload();
        public virtual int BotMoveDelayMs => 1000;

        protected Dictionary<string, object?> GetBasePayload() => new()
        {
            ["roomId"] = RoomId,
            ["gameType"] = GameType,
            ["currentTurnPlayerId"] = CurrentTurnPlayerId,
            ["winnerPlayerId"] = WinnerPlayerId,
            ["winnerSymbol"] = WinnerSymbol,
            ["winningCells"] = WinningCells,
            ["isFinished"] = IsFinished,
            ["hasStarted"] = HasStarted,
            ["isFull"] = IsFull,
            ["isPrivate"] = IsPrivate,
            ["isBotGame"] = IsBotGame,
            ["player1Id"] = Player1Id,
            ["player1Username"] = Player1Username,
            ["player2Id"] = Player2Id,
            ["player2Username"] = Player2Username,
            ["score"] = Score,
            ["player1Score"] = Score[0],
            ["player2Score"] = Score[1],
        };

        protected void SwitchTurn() =>
            CurrentTurnPlayerId = CurrentTurnPlayerId == Player1Id ? Player2Id! : Player1Id!;

        protected bool IsBot(string playerId) => playerId == "__BOT__";

        protected string? GetBotId() =>
            Player1Id == "__BOT__" ? Player1Id : Player2Id == "__BOT__" ? Player2Id : null;

        public abstract void HandleAction(string playerId, JsonElement action);
        public abstract void MakeBotMove();

        public virtual void ResetForNewRound()
        {
            Interlocked.Exchange(ref _roundResultPersisted, 0);
            WinnerPlayerId = null;
            WinnerSymbol = null;
            WinningCells = [];
            IsFinished = false;
            HasStarted = true;
            CurrentTurnPlayerId = Player1Id;
        }

        protected void CompleteRound(string? winnerPlayerId)
        {
            WinnerPlayerId = winnerPlayerId;
            IsFinished = true;

            if (string.IsNullOrEmpty(winnerPlayerId)) return;
            if (winnerPlayerId == Player1Id) Score[0]++;
            else if (winnerPlayerId == Player2Id) Score[1]++;
        }

        public virtual bool NeedsGameLoop => false;
        public virtual int TickIntervalMs => 50;
        public virtual void Tick() { }
        public void ReplacePlayerWithBot(string playerId)
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
