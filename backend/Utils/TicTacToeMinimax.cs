namespace backend.Utils;

public static class TicTacToeMinimax
{
    private const int WinScore = 10;
    private const string EmptyCell = ".";

    public static int GetBestMove(string[] board, string aiSymbol)
    {
        int bestScore = int.MinValue;
        int bestMove = -1;
        string humanSymbol = aiSymbol == "X" ? "O" : "X";

        for (int i = 0; i < board.Length; i++)
        {
            if (board[i] != EmptyCell) continue;

            board[i] = aiSymbol;
            int score = Minimax(board, 0, false, aiSymbol, humanSymbol);
            board[i] = EmptyCell;

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
        if (GameHelper.HasWonTicTacToe(board, aiSymbol)) return WinScore - depth;

        if (GameHelper.HasWonTicTacToe(board, humanSymbol)) return depth - WinScore;

        if (IsBoardFull(board)) return 0;

        var symbol = isMaximizing ? aiSymbol : humanSymbol;
        int best = isMaximizing ? int.MinValue : int.MaxValue;

        for (int i = 0; i < board.Length; i++)
        {
            if (board[i] != EmptyCell) continue;

            board[i] = symbol;
            int score = Minimax(board, depth + 1, !isMaximizing, aiSymbol, humanSymbol);
            board[i] = EmptyCell;

            best = isMaximizing ? Math.Max(best, score) : Math.Min(best, score);
        }

        return best;
    }

    private static bool IsBoardFull(string[] board) => board.All(cell => cell != EmptyCell);
}
