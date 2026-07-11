using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public class TicTacToeRoom : BaseGameRoom
{
    private readonly Lock _lock = new();

    public TicTacToeRoom() : base(GamesKind.TicTacToe) { }
    public string[] Board { get; set; } = [.. Enumerable.Repeat(".", 9)];
    public override object GetStatePayload() => new
    {
        roomId = RoomId,
        board = Board,
        currentTurnPlayerId = CurrentTurnPlayerId,
        winnerPlayerId = WinnerPlayerId,
        winnerSymbol = WinnerSymbol,
        isFinished = IsFinished,
        hasStarted = HasStarted,
        isFull = IsFull,
        isPrivate = IsPrivate,
        isBotGame = IsBotGame,
        player1Id = Player1Id,
        player1Username = Player1Username,
        player2Id = Player2Id,
        player2Username = Player2Username
    };

    public override void ProcessInput(string playerId, object action)
    {
        lock (_lock)
        {
            if (action is not JsonElement json
                || json.ValueKind != JsonValueKind.Object
                || !json.TryGetProperty("type", out var typeProp)
                || typeProp.GetString() != "MAKE_MOVE"
                || !json.TryGetProperty("cell", out var cellProp))
                return;

            var cell = cellProp.GetInt32();

            if (
                IsFinished
                || !IsFull
                || playerId != CurrentTurnPlayerId
                || (playerId != Player1Id && playerId != Player2Id)
                || cell < 0
                || cell > 8
                || Board[cell] != "."
            )
                return;

            Board[cell] = playerId == Player1Id ? "X" : "O";

            if (GameHelper.CheckWinTicTacToe(Board))
            {
                IsFinished = true;
                WinnerPlayerId = playerId;
                WinnerSymbol = Board[cell];
                return;
            }

            if (Board.All(x => x != "."))
            {
                IsFinished = true;
                return;
            }

            CurrentTurnPlayerId =
                playerId == Player1Id
                ? Player2Id!
                : Player1Id!;
        }
    }
}
