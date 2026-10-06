namespace backend.Utils;

public static class ConnectFourMinimax
{
    public const int Cols = 7;
    public const int Rows = 6;
    public const int CenterCol = 3;

    private const int WinValue = 1_000_000;
    private const int DefaultDepth = 5;

    private static readonly int[] ColumnOrder = [3, 2, 4, 1, 5, 0, 6];

    public static int GetRandomMove(int[][] board, bool centerBias = false)
    {
        var open = ConnectFourMinimax.AvailableColumns(board);

        if (centerBias)
        {
            open = [.. open.OrderBy(c => Math.Abs(c - CenterCol))
                      .Take(Math.Max(1, (open.Length + 1) / 2))];
        }

        return RandomHelper.Pick(open);
    }

    public static int GetTacticalMove(int[][] board, int piece)
    {
        var win = FindImmediateWin(board, piece);
        if (win >= 0) return win;

        var block = FindImmediateWin(board, Opponent(piece));
        if (block >= 0) return block;

        return GetRandomMove(board, centerBias: true);
    }

    public static int GetBestMove(int[][] board, int piece, int depth = DefaultDepth)
    {
        int bestCol = -1;
        int bestScore = int.MinValue;

        foreach (var col in ColumnOrder)
        {
            if (!ConnectFourMinimax.TryGetAvailableRow(board, col, out int row)) continue;

            board[col][row] = piece;
            int score = ConnectFourMinimax.HasWon(board, col, row, piece)
                ? WinValue
                : Minimax(board, depth - 1, int.MinValue + 1, int.MaxValue - 1, false, piece);
            board[col][row] = 0;

            if (score > bestScore)
            {
                bestScore = score;
                bestCol = col;
            }
        }

        return bestCol >= 0 ? bestCol : GetRandomMove(board);
    }

    private static int Opponent(int piece) => piece == 1 ? 2 : 1;

    private static int FindImmediateWin(int[][] board, int piece)
    {
        for (int col = 0; col < Cols; col++)
        {
            if (!ConnectFourMinimax.TryGetAvailableRow(board, col, out int row)) continue;

            board[col][row] = piece;
            bool wins = ConnectFourMinimax.HasWon(board, col, row, piece);
            board[col][row] = 0;

            if (wins) return col;
        }
        return -1;
    }

    private static int Minimax(int[][] board, int depth, int alpha, int beta, bool maximizing, int botPiece)
    {
        if (depth == 0 || !ConnectFourMinimax.HasFreeColumn(board)) return EvaluateBoard(board, botPiece);

        int currentPiece = maximizing ? botPiece : Opponent(botPiece);
        int best = maximizing ? int.MinValue + 1 : int.MaxValue - 1;

        foreach (var col in ColumnOrder)
        {
            if (!ConnectFourMinimax.TryGetAvailableRow(board, col, out int row)) continue;

            board[col][row] = currentPiece;

            int score = ConnectFourMinimax.HasWon(board, col, row, currentPiece)
                ? maximizing ? WinValue + depth : -(WinValue + depth)
                : Minimax(board, depth - 1, alpha, beta, !maximizing, botPiece);

            board[col][row] = 0;

            if (maximizing)
            {
                best = Math.Max(best, score);
                alpha = Math.Max(alpha, best);
            }
            else
            {
                best = Math.Min(best, score);
                beta = Math.Min(beta, best);
            }

            if (beta <= alpha) break;
        }

        return best;
    }

    private static int EvaluateBoard(int[][] board, int botPiece)
    {
        int opponent = Opponent(botPiece);
        int center = 0;

        for (int row = 0; row < Rows; row++)
        {
            if (board[CenterCol][row] == botPiece) center += 3;
            else if (board[CenterCol][row] == opponent)
            {
                center -= 3;
            }
        }

        return center + ScoreWindows(board, botPiece, opponent);
    }

    private static int ScoreWindows(int[][] board, int piece, int opponent)
    {
        int score = 0;

        foreach (var window in EnumerateWindows())
        {
            int mine = 0, theirs = 0, empty = 0;

            foreach (var (c, r) in window)
            {
                int value = board[c][r];
                if (value == piece) mine++;
                else if (value == opponent)
                {
                    theirs++;
                }
                else empty++;
            }

            if (mine > 0 && theirs > 0) continue;

            if (mine == 3 && empty == 1) score += 50;
            else if (mine == 2 && empty == 2)
            {
                score += 10;
            }
            else if (mine == 1 && empty == 3)
            {
                score += 1;
            }
            else if (theirs == 3 && empty == 1)
            {
                score -= 80;
            }
            else if (theirs == 2 && empty == 2)
            {
                score -= 10;
            }
        }

        return score;
    }

    private static IEnumerable<(int c, int r)[]> EnumerateWindows()
    {
        for (int c = 0; c < Cols; c++)
        {
            for (int r = 0; r < Rows; r++)
            {
                if (c + 3 < Cols) yield return [(c, r), (c + 1, r), (c + 2, r), (c + 3, r)];

                if (r + 3 < Rows) yield return [(c, r), (c, r + 1), (c, r + 2), (c, r + 3)];

                if (c + 3 < Cols && r + 3 < Rows) yield return [(c, r), (c + 1, r + 1), (c + 2, r + 2), (c + 3, r + 3)];

                if (c + 3 < Cols && r - 3 >= 0) yield return [(c, r), (c + 1, r - 1), (c + 2, r - 2), (c + 3, r - 3)];
            }
        }
    }

    private static readonly (int, int)[] Directions = [(1, 0), (0, 1), (1, 1), (1, -1)];

    public static bool TryGetAvailableRow(int[][] board, int col, out int row)
    {
        for (row = Rows - 1; row >= 0; row--)
        {
            if (board[col][row] == 0) return true;
        }

        row = -1;
        return false;
    }

    public static bool HasFreeColumn(int[][] board)
    {
        for (int col = 0; col < Cols; col++)
        {
            if (board[col][0] == 0) return true;
        }

        return false;
    }

    public static int[] AvailableColumns(int[][] board)
    {
        var open = new List<int>();
        for (int col = 0; col < Cols; col++)
        {
            if (board[col][0] == 0) open.Add(col);
        }

        return [.. open];
    }

    public static List<(int Col, int Row)>? FindWinLine(int[][] board, int col, int row, int piece)
    {
        foreach (var (dCol, dRow) in Directions)
        {
            var cells = new List<(int Col, int Row)> { (col, row) };
            Collect(board, col, row, dCol, dRow, piece, cells);
            Collect(board, col, row, -dCol, -dRow, piece, cells);

            if (cells.Count >= 4) return cells;
        }
        return null;
    }

    public static bool HasWon(int[][] board, int col, int row, int piece) =>
        FindWinLine(board, col, row, piece) is not null;

    private static void Collect(int[][] board, int col, int row, int dCol, int dRow, int piece, List<(int Col, int Row)> into)
    {
        int c = col + dCol;
        int r = row + dRow;

        while (c >= 0 && c < Cols && r >= 0 && r < Rows && board[c][r] == piece)
        {
            into.Add((c, r));
            c += dCol;
            r += dRow;
        }
    }
}
