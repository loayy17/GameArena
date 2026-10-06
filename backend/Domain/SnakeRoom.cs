using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public sealed class SnakeRoom : BaseGameRoom
{
    public const int BoardWidth = 30;
    public const int BoardHeight = 20;
    private const int InitialLength = 3;
    private const int GameTickIntervalMs = 100;
    private const int RandomSpawnAttempts = 100;
    private const int FoodScore = 1000;
    private const int WallScorePerCell = 2;
    private const int EscapeWeight = 5;

    private const string ActionChangeDirection = "CHANGE_DIRECTION";

    private readonly LinkedList<Point> _snake1 = new();
    private readonly LinkedList<Point> _snake2 = new();

    private Direction? _pending1;
    private Direction? _pending2;
    private bool _alive1 = true;
    private bool _alive2 = true;
    private bool _snake1AteFood;
    private bool _snake2AteFood;

    public SnakeRoom() : base(GamesKind.Snake) { }

    public override bool NeedsGameLoop => true;
    public override int TickIntervalMs => GameTickIntervalMs;

    public Point Food { get; private set; }
    public Direction Dir1 { get; private set; } = Direction.Right;
    public Direction Dir2 { get; private set; } = Direction.Left;
    protected override object GetStatePayloadCore()
    {
        var payload = GetBasePayload();
        payload["boardWidth"] = BoardWidth;
        payload["boardHeight"] = BoardHeight;
        payload["food"] = Food;
        payload["player1Snake"] = _snake1.ToArray();
        payload["player2Snake"] = _snake2.ToArray();
        payload["player1Direction"] = Dir1.ToString();
        payload["player2Direction"] = Dir2.ToString();
        payload["player1Score"] = Score[0];
        payload["player2Score"] = Score[1];
        payload["winScore"] = 0;
        payload["tickRateHz"] = 1000 / GameTickIntervalMs;
        return payload;
    }
    protected override void ResetForNewRoundCore()
    {
        base.ResetForNewRoundCore();

        Dir1 = Direction.Right;
        Dir2 = Direction.Left;
        _pending1 = _pending2 = null;
        _alive1 = _alive2 = true;

        _snake1.Clear();
        _snake2.Clear();

        int y = BoardHeight / 2;
        for (int i = 0; i < InitialLength; i++)
        {
            _snake1.AddLast(new Point(2 - i, y));
        }

        for (int i = 0; i < InitialLength; i++)
        {
            _snake2.AddLast(new Point(BoardWidth - 3 + i, y));
        }

        SpawnFood();
    }

    protected override void TickCore()
    {
        if (WinnerPlayerId != null || !HasStarted) return;

        if (_snake1.Count == 0 || _snake2.Count == 0) return;

        MakeBotMoveCore();
        ApplyPendingDirections();
        AdvanceSnakes();
        if (_snake1AteFood || _snake2AteFood) SpawnFood();
        DetectDeaths();
        SettleRound();
    }

    protected override void MakeBotMoveCore()
    {
        if (!IsBotGame || IsFinished || !HasStarted) return;
        if (_alive1 && Player1Id == Constants.BotPlayerId && _snake1.Count > 0) _pending1 = BestDirection(_snake1, Dir1);
        if (_alive2 && Player2Id == Constants.BotPlayerId && _snake2.Count > 0) _pending2 = BestDirection(_snake2, Dir2);
    }

    protected override void HandleActionCore(string playerId, JsonElement action)
    {
        if (Player1Id != playerId && Player2Id != playerId) return;
        if (_snake1.Count == 0 || _snake2.Count == 0) return;
        if (!TryReadDirection(action, out var direction)) return;
        if (playerId == Player1Id && IsLegalTurn(Dir1, direction)) _pending1 = direction;
        else if (playerId == Player2Id && IsLegalTurn(Dir2, direction))
            _pending2 = direction;
    }

    private void ApplyPendingDirections()
    {
        if (_pending1.HasValue && IsLegalTurn(Dir1, _pending1.Value)) Dir1 = _pending1.Value;

        if (_pending2.HasValue && IsLegalTurn(Dir2, _pending2.Value)) Dir2 = _pending2.Value;
        _pending1 = _pending2 = null;
    }

    private void AdvanceSnakes()
    {
        _snake1AteFood = _alive1 && Step(_snake1, Dir1);
        _snake2AteFood = _alive2 && Step(_snake2, Dir2);
    }

    private bool Step(LinkedList<Point> snake, Direction direction)
    {
        var head = snake.First!.Value.Move(direction);

        snake.AddFirst(head);
        if (head.Equals(Food)) return true;
        snake.RemoveLast();
        return false;
    }

    private void SpawnFood()
    {
        for (int attempt = 0; attempt < RandomSpawnAttempts; attempt++)
        {
            var candidate = new Point(
                Random.Shared.Next(BoardWidth),
                Random.Shared.Next(BoardHeight));

            if (!Occupied(candidate))
            {
                Food = candidate;
                return;
            }
        }

        var free = FreeCells();
        if (free.Count > 0) Food = free[RandomHelper.Index(free.Count)];
    }

    private void DetectDeaths()
    {
        if (!_alive1 && !_alive2) return;

        var head1 = _snake1.First!.Value;
        var head2 = _snake2.First!.Value;

        if (_alive1 && IsColliding(head1, _snake1, _snake2)) _alive1 = false;
        if (_alive2 && IsColliding(head2, _snake2, _snake1)) _alive2 = false;

        if (head1.Equals(head2)) _alive1 = _alive2 = false;
    }

    private void SettleRound()
    {
        if (!_alive1 && !_alive2) CompleteRound("");
        else if (!_alive1)
            CompleteRound(Player2Id);
        else if (!_alive2)
            CompleteRound(Player1Id);
    }

    private bool Occupied(Point point) => _snake1.Contains(point) || _snake2.Contains(point);
    private List<Point> FreeCells()
    {
        var free = new List<Point>();
        for (int x = 0; x < BoardWidth; x++)
        {
            for (int y = 0; y < BoardHeight; y++)
            {
                var point = new Point(x, y);
                if (!Occupied(point)) free.Add(point);
            }
        }
        return free;
    }

    private static bool IsColliding(Point head, LinkedList<Point> self, LinkedList<Point> enemy)
    {
        for (var node = self.First!.Next; node != null; node = node.Next)
            if (node.Value.Equals(head)) return true;

        for (var node = enemy.First; node != null; node = node.Next)
            if (node.Value.Equals(head)) return true;

        return false;
    }

    private static bool IsLegalTurn(Direction current, Direction next) =>
        (current, next) is not (Direction.Up, Direction.Down)
            and not (Direction.Down, Direction.Up)
            and not (Direction.Left, Direction.Right)
            and not (Direction.Right, Direction.Left);

    private static bool TryReadDirection(JsonElement action, out Direction direction)
    {
        direction = default;
        if (action.ValueKind != JsonValueKind.Object
            || !action.TryGetProperty("type", out var typeProp)
            || !typeProp.ValueEquals(ActionChangeDirection)
            || !action.TryGetProperty("direction", out var directionProp))
            return false;

        return Enum.TryParse<Direction>(directionProp.GetString(), ignoreCase: true, out direction);
    }

    private Direction BestDirection(LinkedList<Point> snake, Direction current)
    {
        var head = snake.First!.Value;
        var options = new List<(Direction Direction, Point Next, int Score)>();
        foreach (var direction in Enum.GetValues<Direction>())
        {
            if (!IsLegalTurn(current, direction)) continue;
            var next = head.Move(direction);
            options.Add((direction, next, ScoreMove(next)));
        }

        var alive = options.Where(o => o.Score > int.MinValue).ToList();
        if (alive.Count == 0) return current;

        return BotDifficulty switch
        {
            BotDifficulty.Easy => alive[RandomHelper.Index(alive.Count)].Direction,
            BotDifficulty.Hard => alive
                .Select(o => (o.Direction, Score: o.Score + EscapeBonus(o.Next, snake.Count + 1)))
                .OrderByDescending(o => o.Score)
                .First().Direction,
            _ => alive.OrderByDescending(o => o.Score).First().Direction
        };
    }

    private int EscapeBonus(Point start, int needed)
    {
        int reachable = CountReachable(start, needed);
        return Math.Min(reachable, needed) * EscapeWeight;
    }

    private int CountReachable(Point start, int needed)
    {
        var seen = new HashSet<Point> { start };
        var queue = new Queue<Point>();
        queue.Enqueue(start);

        while (queue.Count > 0 && seen.Count < needed)
        {
            var current = queue.Dequeue();
            foreach (var direction in Enum.GetValues<Direction>())
            {
                var next = current.Move(direction);
                if (seen.Contains(next) || Occupied(next)) continue;
                seen.Add(next);
                queue.Enqueue(next);
            }
        }
        return seen.Count;
    }

    private int ScoreMove(Point point)
    {
        if (Occupied(point)) return int.MinValue;

        int dx = Math.Abs(point.X - Food.X);
        int dy = Math.Abs(point.Y - Food.Y);
        dx = Math.Min(dx, BoardWidth - dx);
        dy = Math.Min(dy, BoardHeight - dy);
        int score = point.Equals(Food) ? FoodScore : 0;
        score -= dx + dy;
        score += WallDistance(point) * WallScorePerCell;
        return score;
    }

    private static int WallDistance(Point point) =>
        Math.Min(
            Math.Min(point.X, BoardWidth - 1 - point.X),
            Math.Min(point.Y, BoardHeight - 1 - point.Y));
}

public readonly record struct Point(int X, int Y)
{
    public Point Move(Direction d) => d switch
    {
        Direction.Up => new(X, (Y - 1 + SnakeRoom.BoardHeight) % SnakeRoom.BoardHeight),
        Direction.Down => new(X, (Y + 1) % SnakeRoom.BoardHeight),
        Direction.Left => new((X - 1 + SnakeRoom.BoardWidth) % SnakeRoom.BoardWidth, Y),
        Direction.Right => new((X + 1) % SnakeRoom.BoardWidth, Y),
        _ => this
    };
}
