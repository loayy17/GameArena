using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public class TicTacToeRoom : BaseGameRoom
{
    private readonly Lock _lock = new();

    public TicTacToeRoom() : base(GamesKind.TicTacToe) { }
    public string[] Board { get; set; } = [.. Enumerable.Repeat(".", 9)];
    public override object GetStatePayload()
    {
        var p = GetBasePayload();
        p["board"] = Board;
        p["boardWidth"] = 3;
        p["boardHeight"] = 3;
        p["winScore"] = 0;
        p["tickRateHz"] = 0;
        return p;
    }

    public override void ResetForNewRound()
    {
        base.ResetForNewRound();
        Board = [.. Enumerable.Repeat(".", 9)];
    }

    public override void HandleAction(string playerId, JsonElement action)
    {
        lock (_lock)
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
    }

    public override void MakeBotMove()
    {
        lock (_lock)
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
    }

    public override void OnPlayerDisconnected(string disconnectedPlayerId)
    {
        base.OnPlayerDisconnected(disconnectedPlayerId);
        WinnerSymbol = WinnerPlayerId == Player1Id ? "X" : "O";
    }
}
