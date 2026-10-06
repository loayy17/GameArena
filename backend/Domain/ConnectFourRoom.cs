using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public sealed class ConnectFourRoom : BaseGameRoom
{
    private const string ActionPlace = "place";
    private const int FirstPiece = 1;
    private const int SecondPiece = 2;

    public ConnectFourRoom() : base(GamesKind.ConnectFour) { }

    public int[][] Board { get; set; } = CreateEmptyBoard();

    protected override object GetStatePayloadCore()
    {
        var payload = GetBasePayload();
        payload["board"] = Board;
        payload["boardWidth"] = ConnectFourMinimax.Cols;
        payload["boardHeight"] = ConnectFourMinimax.Rows;
        payload["winScore"] = 1;
        payload["tickRateHz"] = 0;
        return payload;
    }

    protected override void ResetForNewRoundCore()
    {
        base.ResetForNewRoundCore();
        Board = CreateEmptyBoard();
    }

    protected override void HandleActionCore(string playerId, JsonElement action)
    {
        if (WinnerPlayerId != null
            || !IsFull
            || playerId != CurrentTurnPlayerId
            || !IsSeated(playerId)
            || !TryReadColumn(action, out int col)
            || !ConnectFourMinimax.TryGetAvailableRow(Board, col, out int row))
        {
            return;
        }

        Board[col][row] = PieceFor(playerId);
        SettleRound(playerId, col, row);
    }

    protected override void MakeBotMoveCore()
    {
        if (WinnerPlayerId != null || CurrentTurnPlayerId == null) return;

        var botId = GetBotId();
        if (botId == null || CurrentTurnPlayerId != botId) return;

        int piece = PieceFor(botId);
        int col = BotDifficulty switch
        {
            BotDifficulty.Easy => ConnectFourMinimax.GetRandomMove(Board),
            BotDifficulty.Medium => ConnectFourMinimax.GetTacticalMove(Board, piece),
            _ => ConnectFourMinimax.GetBestMove(Board, piece),
        };

        if (col < 0 || !ConnectFourMinimax.TryGetAvailableRow(Board, col, out int row)) return;

        Board[col][row] = piece;
        SettleRound(botId, col, row);
    }

    protected override void OnPlayerDisconnectedCore(string disconnectedPlayerId)
    {
        base.OnPlayerDisconnectedCore(disconnectedPlayerId);
        WinnerSymbol = WinnerPlayerId == Player1Id ? "🔴" : "🟡";
    }

    private void SettleRound(string playerId, int col, int row)
    {
        int piece = PieceFor(playerId);
        var winLine = ConnectFourMinimax.FindWinLine(Board, col, row, piece);

        if (winLine != null)
        {
            WinningCells = [.. winLine.Select(c => $"{c.Col}-{c.Row}")];
            WinnerSymbol = piece == FirstPiece ? "🔴" : "🟡";
            CompleteRound(playerId);
            return;
        }

        if (!ConnectFourMinimax.HasFreeColumn(Board))
        {
            CompleteRound("");
            return;
        }

        SwitchTurn();
    }

    private static int[][] CreateEmptyBoard() =>
        [.. Enumerable.Range(0, ConnectFourMinimax.Cols).Select(_ => new int[ConnectFourMinimax.Rows])];

    private int PieceFor(string playerId) => playerId == Player1Id ? FirstPiece : SecondPiece;

    private bool IsSeated(string playerId) => playerId == Player1Id || playerId == Player2Id;

    private static bool TryReadColumn(JsonElement action, out int col)
    {
        col = -1;

        if (action.ValueKind != JsonValueKind.Object
            || !action.TryGetProperty("type", out var typeProp)
            || !typeProp.ValueEquals(ActionPlace)
            || !action.TryGetProperty("col", out var columnProp)
            || !columnProp.TryGetInt32(out col))
        {
            return false;
        }

        return col >= 0 && col < ConnectFourMinimax.Cols;
    }
}
