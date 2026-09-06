using backend.Enums;
using System.Text.Json;

namespace backend.Domain
{
    public sealed class ConnectFourRoom : BaseGameRoom
    {
        private readonly Lock _lock = new();

        public const int Cols = 7;
        public const int Rows = 6;
        public int[][] Board { get; set; } = Enumerable.Range(0, Cols).Select(_ => new int[Rows]).ToArray();

        public ConnectFourRoom() : base(GamesKind.ConnectFour) { }

        public override object GetStatePayload()
        {
            var p = GetBasePayload();
            p["board"] = Board;
            p["boardWidth"] = Cols;
            p["boardHeight"] = Rows;
            p["winScore"] = 1;
            p["tickRateHz"] = 0;
            return p;
        }

        public override void ResetForNewRound()
        {
            base.ResetForNewRound();
            Board = Enumerable.Range(0, Cols).Select(_ => new int[Rows]).ToArray();
        }

        private static bool TryParseAction(JsonElement action, out int col)
        {
            col = -1;
            if (action.ValueKind != JsonValueKind.Object) return false;
            if (!action.TryGetProperty("type", out var type) || !type.ValueEquals("place")) return false;
            if (!action.TryGetProperty("col", out var column)) return false;
            return column.TryGetInt32(out col) && col >= 0 && col < Cols;
        }

        private void CollectDirection(int col, int row, int dCol, int dRow, int piece, List<(int Col, int Row)> cells)
        {
            int currentCol = col + dCol;
            int currentRow = row + dRow;
            while (currentCol >= 0 && currentCol < Cols && currentRow >= 0 && currentRow < Rows && Board[currentCol][currentRow] == piece)
            {
                cells.Add((currentCol, currentRow));
                currentCol += dCol;
                currentRow += dRow;
            }
        }

        private string[]? FindWinLine(int col, int row, int piece)
        {
            int[][] directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
            foreach (var direction in directions)
            {
                var cells = new List<(int Col, int Row)> { (col, row) };
                CollectDirection(col, row, direction[0], direction[1], piece, cells);
                CollectDirection(col, row, -direction[0], -direction[1], piece, cells);
                if (cells.Count >= 4)
                    return cells.Select(c => $"{c.Col}-{c.Row}").ToArray();
            }
            return null;
        }

        private bool TryGetAvailableRow(int col, out int row)
        {
            for (row = Rows - 1; row >= 0; row--)
                if (Board[col][row] == 0) return true;
            row = -1;
            return false;
        }

        private bool IsBoardFull()
        {
            for (int col = 0; col < Cols; col++)
                if (Board[col][0] == 0) return false;
            return true;
        }

        public override void HandleAction(string playerId, JsonElement action)
        {
            lock (_lock)
            {
                if (WinnerPlayerId != null
                    || !IsFull
                    || playerId != CurrentTurnPlayerId
                    || (playerId != Player1Id && playerId != Player2Id)
                    || !TryParseAction(action, out int col)
                    || !TryGetAvailableRow(col, out int row))
                    return;

                int piece = playerId == Player1Id ? 1 : 2;
                Board[col][row] = piece;

                var winLine = FindWinLine(col, row, piece);
                if (winLine != null)
                {
                    WinningCells = winLine;
                    WinnerSymbol = piece == 1 ? "🔴" : "🟡";
                    CompleteRound(playerId);
                    return;
                }

                if (IsBoardFull())
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
                if (!IsBotGame || WinnerPlayerId != null || CurrentTurnPlayerId == null) return;
                var botId = GetBotId();
                if (botId == null || CurrentTurnPlayerId != botId) return;
                int piece = botId == Player1Id ? 1 : 2;

                List<int> availableColumns = [];
                for (int col = 0; col < Cols; col++)
                    if (Board[col][0] == 0)
                        availableColumns.Add(col);

                if (availableColumns.Count == 0) return;
                int randomCol = availableColumns[Random.Shared.Next(availableColumns.Count)];
                if (!TryGetAvailableRow(randomCol, out int row))
                    return;

                Board[randomCol][row] = piece;

                var winLine = FindWinLine(randomCol, row, piece);
                if (winLine != null)
                {
                    WinningCells = winLine;
                    WinnerSymbol = piece == 1 ? "🔴" : "🟡";
                    CompleteRound(botId);
                    return;
                }

                if (IsBoardFull())
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
            WinnerSymbol = WinnerPlayerId == Player1Id ? "🔴" : "🟡";
        }
    }
}
