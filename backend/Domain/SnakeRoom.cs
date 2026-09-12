using System.Text.Json;
using backend.Enums;

namespace backend.Domain
{
    public sealed class SnakeRoom : BaseGameRoom
    {
        public static readonly int BoardWidth = 30;
        public static readonly int BoardHeight = 20;
        private const int InitialLength = 3;
        private const int GameTickIntervalMs = 100;
        private const int MaxRandomSpawnAttempts = 100;

        private const string ActionChangeDirection = "CHANGE_DIRECTION";

        public Point Food { get; private set; }
        public Direction Dir1 { get; private set; } = Direction.Right;
        public Direction Dir2 { get; private set; } = Direction.Left;

        private readonly LinkedList<Point> _snake1 = new();
        private readonly LinkedList<Point> _snake2 = new();

        private Direction? _pending1;
        private Direction? _pending2;
        private bool _alive1 = true;
        private bool _alive2 = true;

        public SnakeRoom() : base(GamesKind.Snake) { }

        public override bool NeedsGameLoop => true;
        public override int TickIntervalMs => GameTickIntervalMs;

        protected override void TickCore()
        {
            if (WinnerPlayerId != null || !HasStarted) return;
            if (_snake1.Count == 0 || _snake2.Count == 0) return;

            MakeBotMoveCore();
            ApplyDirections();
            MovePlayers();
            HandleFood();
            HandleCollisions();
            ResolveWinner();
        }

        private void ApplyDirections()
        {
            if (_pending1.HasValue && IsValidTurn(Dir1, _pending1.Value)) Dir1 = _pending1.Value;
            _pending1 = null;

            if (_pending2.HasValue && IsValidTurn(Dir2, _pending2.Value)) Dir2 = _pending2.Value;
            _pending2 = null;
        }

        private void MovePlayers()
        {
            if (_alive1) MoveSnake(_snake1, Dir1);
            if (_alive2) MoveSnake(_snake2, Dir2);
        }

        private bool MoveSnake(LinkedList<Point> snake, Direction dir)
        {
            var head = snake.First!.Value;
            var next = head.Move(dir);

            snake.AddFirst(next);

            if (next.Equals(Food)) return true;

            snake.RemoveLast();
            return false;
        }

        private void HandleFood()
        {
            bool ate1 = false, ate2 = false;

            if (_alive1 && _snake1.First!.Value.Equals(Food)) ate1 = true;
            if (_alive2 && _snake2.First!.Value.Equals(Food)) ate2 = true;

            if (ate1 || ate2) SpawnFood();
        }

        private void SpawnFood()
        {
            for (int i = 0; i < MaxRandomSpawnAttempts; i++)
            {
                var p = new Point(Random.Shared.Next(BoardWidth), Random.Shared.Next(BoardHeight));
                if (!_snake1.Contains(p) && !_snake2.Contains(p))
                {
                    Food = p;
                    return;
                }
            }

            var free = new List<Point>();
            for (int x = 0; x < BoardWidth; x++)
                for (int y = 0; y < BoardHeight; y++)
                {
                    var p = new Point(x, y);
                    if (!_snake1.Contains(p) && !_snake2.Contains(p))
                        free.Add(p);
                }

            if (free.Count > 0)
                Food = free[Random.Shared.Next(free.Count)];
        }

        private void HandleCollisions()
        {
            if (!_alive1 && !_alive2) return;

            var h1 = _snake1.First!.Value;
            var h2 = _snake2.First!.Value;

            if (_alive1 && IsDead(h1, _snake1, _snake2)) _alive1 = false;
            if (_alive2 && IsDead(h2, _snake2, _snake1)) _alive2 = false;

            if (h1.Equals(h2)) _alive1 = _alive2 = false;
        }

        private bool IsDead(Point head, LinkedList<Point> me, LinkedList<Point> enemy)
        {
            var cur = me.First!.Next;
            while (cur != null)
            {
                if (cur.Value.Equals(head)) return true;
                cur = cur.Next;
            }

            cur = enemy.First;
            while (cur != null)
            {
                if (cur.Value.Equals(head)) return true;
                cur = cur.Next;
            }

            return false;
        }

        private void ResolveWinner()
        {
            if (!_alive1 && !_alive2) CompleteRound("");
            else if (!_alive1) CompleteRound(Player2Id);
            else if (!_alive2) CompleteRound(Player1Id);
        }

        protected override void HandleActionCore(string playerId, JsonElement action)
        {
            if (Player1Id != playerId && Player2Id != playerId) return;
            if (_snake1.Count == 0 || _snake2.Count == 0) return;
            if (!TryParseAction(action, out var dir)) return;

            if (playerId == Player1Id && IsValidTurn(Dir1, dir)) _pending1 = dir;
            else if (playerId == Player2Id && IsValidTurn(Dir2, dir)) _pending2 = dir;
        }

        private static bool TryParseAction(JsonElement action, out Direction dir)
        {
            dir = default;
            if (action.ValueKind != JsonValueKind.Object) return false;
            if (!action.TryGetProperty("type", out var t) || !t.ValueEquals(ActionChangeDirection)) return false;
            if (!action.TryGetProperty("direction", out var d)) return false;
            return Enum.TryParse<Direction>(d.GetString(), true, out dir);
        }

        private static bool IsValidTurn(Direction cur, Direction next)
            => (cur, next) is not (Direction.Up, Direction.Down)
                and not (Direction.Down, Direction.Up)
                and not (Direction.Left, Direction.Right)
                and not (Direction.Right, Direction.Left);

        protected override void MakeBotMoveCore()
        {
            if (!IsBotGame || IsFinished || !HasStarted) return;
            if (_alive1 && Player1Id == "__BOT__" && _snake1.Count > 0)
                _pending1 = BestDirection(_snake1, Dir1);
            if (_alive2 && Player2Id == "__BOT__" && _snake2.Count > 0)
                _pending2 = BestDirection(_snake2, Dir2);
        }

        private Direction BestDirection(LinkedList<Point> snake, Direction current)
        {
            var head = snake.First!.Value;
            var best = current;
            var bestScore = int.MinValue;

            foreach (var d in Enum.GetValues<Direction>())
            {
                if (!IsValidTurn(current, d)) continue;
                var next = head.Move(d);
                int s = ScoreMove(next);
                if (s > bestScore) { bestScore = s; best = d; }
            }
            return best;
        }

        private int ScoreMove(Point p)
        {
            if (_snake1.Contains(p) || _snake2.Contains(p)) return int.MinValue;

            int dx = Math.Abs(p.X - Food.X);
            int dy = Math.Abs(p.Y - Food.Y);
            dx = Math.Min(dx, BoardWidth - dx);
            dy = Math.Min(dy, BoardHeight - dy);
            int dist = dx + dy;

            int s = (p.X == Food.X && p.Y == Food.Y) ? 1000 : 0;
            s -= dist;
            s += Math.Min(Math.Min(p.X, BoardWidth - 1 - p.X), Math.Min(p.Y, BoardHeight - 1 - p.Y)) * 2;
            return s;
        }

        protected override void ResetForNewRoundCore()
        {
            base.ResetForNewRoundCore();
            Dir1 = Direction.Right; Dir2 = Direction.Left;
            _pending1 = _pending2 = null;
            _alive1 = _alive2 = true;

            _snake1.Clear(); _snake2.Clear();

            int y = BoardHeight / 2;
            for (int i = 0; i < InitialLength; i++) _snake1.AddLast(new Point(2 - i, y));
            for (int i = 0; i < InitialLength; i++) _snake2.AddLast(new Point(BoardWidth - 3 + i, y));

            SpawnFood();
        }

        protected override object GetStatePayloadCore()
        {
            var p = GetBasePayload();
            p["boardWidth"] = BoardWidth;
            p["boardHeight"] = BoardHeight;
            p["food"] = Food;
            p["player1Snake"] = _snake1.ToArray();
            p["player2Snake"] = _snake2.ToArray();
            p["player1Direction"] = Dir1.ToString();
            p["player2Direction"] = Dir2.ToString();
            p["player1Score"] = Score[0];
            p["player2Score"] = Score[1];
            p["winScore"] = 0;
            p["tickRateHz"] = 10;
            return p;
        }
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
}
