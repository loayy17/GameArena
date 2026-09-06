namespace backend.Utils
{
    public static class GameHelper
    {
        private static readonly int[][] TicTacToeWinLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        public static int[]? FindWinLineTicTacToe(string[] board, string? symbol = null)
        {
            foreach (var line in TicTacToeWinLines)
            {
                var cell = board[line[0]];
                if (cell == "." || (symbol != null && cell != symbol)) continue;
                if (board[line[1]] == cell && board[line[2]] == cell) return line;
            }
            return null;
        }

        public static bool CheckWinTicTacToe(string[] board, string? symbol = null) =>
            FindWinLineTicTacToe(board, symbol) != null;
    }
}
