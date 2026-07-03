namespace backend.Utils
{
    public static class TicTacToeMinimax
    {
        private static readonly int[][] WinLines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        public static int GetBestMove(string[] board, string aiSymbol)
        {
            int bestScore = int.MinValue;
            int bestMove = -1;
            string humanSymbol = aiSymbol == "X" ? "O" : "X";

            for (int i = 0; i < 9; i++)
            {
                if (board[i] != ".") continue;

                board[i] = aiSymbol;
                int score = Minimax(board, 0, false, aiSymbol, humanSymbol);
                board[i] = ".";

                if (score > bestScore)
                {
                    bestScore = score;
                    bestMove = i;
                }
            }

            return bestMove;
        }

        private static int Minimax(string[] board, int depth, bool isMaximizing, string aiSymbol, string humanSymbol)
        {
            if (CheckWinner(board, aiSymbol)) return 10 - depth;
            if (CheckWinner(board, humanSymbol)) return depth - 10;
            if (IsBoardFull(board)) return 0;

            if (isMaximizing)
            {
                int bestScore = int.MinValue;
                for (int i = 0; i < 9; i++)
                {
                    if (board[i] != ".") continue;
                    board[i] = aiSymbol;
                    int score = Minimax(board, depth + 1, false, aiSymbol, humanSymbol);
                    board[i] = ".";
                    if (score > bestScore) bestScore = score;
                }
                return bestScore;
            }
            else
            {
                int bestScore = int.MaxValue;
                for (int i = 0; i < 9; i++)
                {
                    if (board[i] != ".") continue;
                    board[i] = humanSymbol;
                    int score = Minimax(board, depth + 1, true, aiSymbol, humanSymbol);
                    board[i] = ".";
                    if (score < bestScore) bestScore = score;
                }
                return bestScore;
            }
        }

        private static bool CheckWinner(string[] board, string symbol)
        {
            foreach (var line in WinLines)
            {
                if (board[line[0]] == symbol && board[line[1]] == symbol && board[line[2]] == symbol)
                    return true;
            }
            return false;
        }

        private static bool IsBoardFull(string[] board)
        {
            return board.All(cell => cell != ".");
        }
    }
}
