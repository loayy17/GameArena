using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain
{
    public class TicTacToeRoom : BaseGameRoom
    {
        public TicTacToeRoom() : base(GamesKind.TicTacToe) { }
        public string[] Board { get; set; } = [.. Enumerable.Repeat(".", 9)];

        protected override object GetStatePayloadCore()
        {
            var p = GetBasePayload();
            p["board"] = Board;
            p["boardWidth"] = 3;
            p["boardHeight"] = 3;
            p["winScore"] = 0;
            p["tickRateHz"] = 0;
            return p;
        }

        protected override void ResetForNewRoundCore()
        {
            base.ResetForNewRoundCore();
            Board = [.. Enumerable.Repeat(".", 9)];
        }

        protected override void HandleActionCore(string playerId, JsonElement action)
        {
            if (action.ValueKind != JsonValueKind.Object
                || !action.TryGetProperty("type", out var typeProp)
                || typeProp.GetString() != "MAKE_MOVE"
                || !action.TryGetProperty("cell", out var cellProp))
                return;

            var cell = cellProp.GetInt32();

            if (
                WinnerPlayerId != null
                || !IsFull
                || playerId != CurrentTurnPlayerId
                || (playerId != Player1Id && playerId != Player2Id)
                || cell < 0
                || cell > 8
                || Board[cell] != "."
            )
                return;

            Board[cell] = playerId == Player1Id ? "X" : "O";

            var winLine = GameHelper.FindWinLineTicTacToe(Board);
            if (winLine != null)
            {
                WinningCells = winLine.Select(i => i.ToString()).ToArray();
                WinnerSymbol = Board[cell];
                CompleteRound(playerId);
                return;
            }

            if (Board.All(x => x != "."))
            {
                CompleteRound("");
                return;
            }

            SwitchTurn();
        }

        protected override void MakeBotMoveCore()
        {
            if (WinnerPlayerId != null || CurrentTurnPlayerId == null) return;
            var botId = GetBotId();
            if (botId == null || CurrentTurnPlayerId != botId) return;
            var botSymbol = botId == Player1Id ? "X" : "O";
            var botMove = TicTacToeMinimax.GetBestMove(Board, botSymbol);
            if (botMove < 0) return;
            Board[botMove] = botSymbol;
            var winLine = GameHelper.FindWinLineTicTacToe(Board);
            if (winLine != null)
            {
                WinningCells = winLine.Select(i => i.ToString()).ToArray();
                WinnerSymbol = Board[botMove];
                CompleteRound(botId);
                return;
            }

            if (Board.All(x => x != "."))
            {
                CompleteRound("");
                return;
            }

            SwitchTurn();
        }

        protected override void OnPlayerDisconnectedCore(string disconnectedPlayerId)
        {
            base.OnPlayerDisconnectedCore(disconnectedPlayerId);
            WinnerSymbol = WinnerPlayerId == Player1Id ? "X" : "O";
        }
    }
}
