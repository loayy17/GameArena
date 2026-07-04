namespace backend.Utils
{
    public static class GameHelper
    {

        /*
         0 1 2 
         3 4 5 
         6 7 8
         */
        public static bool CheckWinTicTacToe(string[] board)
        {
            int[][] winLines = [[0,1,2], [3, 4, 5], [6, 7, 8],[0,3,6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
            foreach (var line in winLines)
                if (board[line[0]] != "." && board[line[0]] == board[line[1]] && board[line[0]] == board[line[2]])
                    return true;
            return false;
        }
    }
}
