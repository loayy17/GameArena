using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public class TicTacToeRoom : BaseGameRoom
{
    private const string EmptyCell = ".";
    private const string ActionMakeMove = "MAKE_MOVE";
    private static readonly string[] FreshBoard = [.. Enumerable.Repeat(EmptyCell, 9)];
    public TicTacToeRoom() : base(GamesKind.TicTacToe) { }
    public string[] Board { get; set; } = [.. FreshBoard];

    protected override object GetStatePayloadCore()
    {
        var payload = GetBasePayload();
        payload["board"] = Board;
        payload["boardWidth"] = 3;
        payload["boardHeight"] = 3;
        payload["winScore"] = 0;
        payload["tickRateHz"] = 0;
        return payload;
    }

    protected override void ResetForNewRoundCore()
    {
        base.ResetForNewRoundCore();
        Board = [.. FreshBoard];
    }

    protected override void HandleActionCore(string playerId, JsonElement action)
    {
        if (!TryReadCell(action, out int cell)) return;

        if (WinnerPlayerId != null
            || !IsFull
            || playerId != CurrentTurnPlayerId
            || !IsSeated(playerId)
            || cell < 0
            || cell > 8
            || Board[cell] != EmptyCell)
            return;

        Board[cell] = playerId == Player1Id ? "X" : "O";
        SettleRound(playerId, Board[cell]);
    }

    protected override void MakeBotMoveCore()
    {
        var botId = CurrentBotTurn();
        if (botId == null) return;
        var botSymbol = botId == Player1Id ? "X" : "O";
        int move = BotDifficulty switch
        {
            BotDifficulty.Easy => RandomFreeCell(),
            BotDifficulty.Medium => RandomHelper.CoinFlip()
                ? RandomFreeCell()
                : TicTacToeMinimax.GetBestMove(Board, botSymbol),
            _ => TicTacToeMinimax.GetBestMove(Board, botSymbol),
        };

        if (move < 0) return;
        Board[move] = botSymbol;
        SettleRound(botId, botSymbol);
    }

    protected override void OnPlayerDisconnectedCore(string disconnectedPlayerId)
    {
        base.OnPlayerDisconnectedCore(disconnectedPlayerId);
        WinnerSymbol = WinnerPlayerId == Player1Id ? "X" : "O";
    }

    private void SettleRound(string playerId, string symbol)
    {
        var winLine = GameHelper.FindWinLineTicTacToe(Board);
        if (winLine != null)
        {
            WinningCells = [.. winLine.Select(i => i.ToString())];
            WinnerSymbol = symbol;
            CompleteRound(playerId);
            return;
        }

        if (Board.All(x => x != EmptyCell))
        {
            CompleteRound("");
            return;
        }

        SwitchTurn();
    }

    private static bool TryReadCell(JsonElement action, out int cell)
    {
        cell = -1;

        if (action.ValueKind != JsonValueKind.Object
            || !action.TryGetProperty("type", out var typeProp)
            || typeProp.GetString() != ActionMakeMove
            || !action.TryGetProperty("cell", out var cellProp))
            return false;
        return cellProp.TryGetInt32(out cell);
    }

    private bool IsSeated(string playerId) => playerId == Player1Id || playerId == Player2Id;
    private string? CurrentBotTurn()
    {
        if (CurrentTurnPlayerId == null) return null;

        var botId = GetBotId();
        return botId != null && CurrentTurnPlayerId == botId ? botId : null;
    }

    private int RandomFreeCell()
    {
        var free = new List<int>();
        for (int i = 0; i < Board.Length; i++)
            if (Board[i] == EmptyCell) free.Add(i);

        return RandomHelper.Pick(free);
    }
}
