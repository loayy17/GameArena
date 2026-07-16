using backend.Enums;
using System.Text.Json;

namespace backend.Domain
{
    public class PingPongRoom : BaseGameRoom
    {
        private readonly Lock _lock = new();

        public PingPongRoom() : base(GamesKind.PingPong) { }

        public float BallPX { get; set; } = 0.5f;
        public float BallPY { get; set; } = 0.5f;
        public float BallVX { get; set; } = InitialBallSpeed;
        public float BallVY { get; set; } = 0.006f;

        public float PadYP1 { get; set; } = 0.4f;
        public float PadHP1 { get; set; } = 0.2f;
        public float PadVP1 { get; set; } = 0.02f;
        public float PadYP2 { get; set; } = 0.4f;
        public float PadHP2 { get; set; } = 0.2f;
        public float PadVP2 { get; set; } = 0.02f;

        public int ScoreP1 { get; set; } = 0;
        public int ScoreP2 { get; set; } = 0;

        private const int WinScore = 5;
        private const float PaddleLeftEdge = 0.03f;
        private const float PaddleRightEdge = 0.97f;
        private const float InitialBallSpeed = 0.012f;
        private const float BallSpeedRamp = 1.002f;

        private const string ActionMovePaddle = "MOVE_PADDLE";
        private const string DirectionUp = "UP";
        private const string DirectionDown = "DOWN";

        // Must match BOARD_WIDTH / BOARD_HEIGHT in the PingPongPage frontend component.
        private const int BoardWidthPx = 600;
        private const int BoardHeightPx = 400;

        private void ResetBall()
        {
            BallPX = 0.5f;
            BallPY = 0.5f;

            // Random.Shared is a single thread-safe instance reused across the
            // process. The previous `new Random()` here was seeded from the
            // system clock on every call, so resets happening close together
            // (same tick, or concurrent rooms) could land on identical seeds
            // and therefore identical "random" bounce directions.
            BallVX = (Random.Shared.Next(2) == 0 ? 1f : -1f) * InitialBallSpeed;
            BallVY = (float)(Random.Shared.NextDouble() * 0.01 - 0.005);
        }

        public override bool NeedsGameLoop => true;

        public override void Tick()
        {
            lock (_lock)
            {
                AdvanceBall();
                AdvanceBot();
            }
        }

        private void AdvanceBall()
        {
            if (WinnerPlayerId != null || !HasStarted) return;

            BallPX += BallVX;
            BallPY += BallVY;

            if (BallPY <= 0 || BallPY >= 1)
            {
                BallVY = -BallVY;
                BallPY = Math.Clamp(BallPY, 0.01f, 0.99f);
            }

            float paddleTop1 = PadYP1;
            float paddleBottom1 = PadYP1 + PadHP1;
            if (BallVX < 0 && BallPX <= PaddleLeftEdge && BallPY >= paddleTop1 && BallPY <= paddleBottom1)
            {
                BallVX = -BallVX;
                BallPX = PaddleLeftEdge;
                float hitPos = (BallPY - PadYP1) / PadHP1;
                BallVY = (hitPos - 0.5f) * 0.02f;
            }

            float paddleTop2 = PadYP2;
            float paddleBottom2 = PadYP2 + PadHP2;
            if (BallVX > 0 && BallPX >= PaddleRightEdge && BallPY >= paddleTop2 && BallPY <= paddleBottom2)
            {
                BallVX = -BallVX;
                BallPX = PaddleRightEdge;
                float hitPos = (BallPY - PadYP2) / PadHP2;
                BallVY = (hitPos - 0.5f) * 0.02f;
            }

            if (BallPX >= 1)
            {
                ScoreP1++;
                if (ScoreP1 >= WinScore)
                {
                    WinnerPlayerId = Player1Id;
                    Score[0]++;
                    return;
                }
                ResetBall();
            }

            if (BallPX <= 0)
            {
                ScoreP2++;
                if (ScoreP2 >= WinScore)
                {
                    WinnerPlayerId = Player2Id;
                    Score[1]++;
                    return;
                }
                ResetBall();
            }

            // Ramp difficulty slightly every tick.
            BallVX *= BallSpeedRamp;
            BallVY *= BallSpeedRamp;
        }

        private void AdvanceBot()
        {
            if (!IsBotGame || IsFinished || !HasStarted) return;

            string? botId = Player1Id == "__BOT__" ? Player1Id : (Player2Id == "__BOT__" ? Player2Id : null);
            if (botId == null) return;

            float botPaddleY = botId == Player1Id ? PadYP1 : PadYP2;
            float paddleHeight = botId == Player1Id ? PadHP1 : PadHP2;
            float targetY = BallPY - paddleHeight / 2f;
            float speed = 0.015f;

            float diff = targetY - botPaddleY;
            if (Math.Abs(diff) < speed)
                botPaddleY = targetY;
            else if (diff > 0)
                botPaddleY += speed;
            else
                botPaddleY -= speed;

            botPaddleY = Math.Clamp(botPaddleY, 0, 1 - paddleHeight);

            if (botId == Player1Id)
                PadYP1 = botPaddleY;
            else
                PadYP2 = botPaddleY;
        }

        public override object GetStatePayload() => new
        {
            roomId = RoomId,
            player1Id = Player1Id,
            player1Username = Player1Username,
            player2Id = Player2Id,
            player2Username = Player2Username,
            hasStarted = HasStarted,
            isFull = IsFull,
            isPrivate = IsPrivate,
            isBotGame = IsBotGame,
            isFinished = IsFinished,
            winnerPlayerId = WinnerPlayerId,
            currentTurnPlayerId = CurrentTurnPlayerId,
            ballPosition = new { x = BallPX * BoardWidthPx, y = BallPY * BoardHeightPx },
            player1PaddleY = PadYP1 * BoardHeightPx,
            player2PaddleY = PadYP2 * BoardHeightPx,
            player1Score = ScoreP1,
            player2Score = ScoreP2,
            score = Score
        };

        public override void ResetForNewRound()
        {
            base.ResetForNewRound();
            ScoreP1 = 0;
            ScoreP2 = 0;
            PadYP1 = 0.4f;
            PadHP1 = 0.2f;
            PadVP1 = 0.02f;
            PadYP2 = 0.4f;
            PadHP2 = 0.2f;
            PadVP2 = 0.02f;
            ResetBall();
        }

        public override void HandleAction(string playerId, JsonElement action)
        {
            lock (_lock)
            {
                if (Player1Id != playerId && Player2Id != playerId) return;

                if (action.ValueKind != JsonValueKind.Object
                    || !action.TryGetProperty("type", out var typeProp)
                    || !typeProp.ValueEquals(ActionMovePaddle)
                    || !action.TryGetProperty("direction", out var directionProp))
                    return;

                bool isUp = directionProp.ValueEquals(DirectionUp);
                if (!isUp && !directionProp.ValueEquals(DirectionDown)) return;

                if (playerId == Player1Id)
                {
                    PadYP1 = isUp
                        ? Math.Max(0, PadYP1 - PadVP1)
                        : Math.Min(1 - PadHP1, PadYP1 + PadVP1);
                }
                else
                {
                    PadYP2 = isUp
                        ? Math.Max(0, PadYP2 - PadVP2)
                        : Math.Min(1 - PadHP2, PadYP2 + PadVP2);
                }
            }
        }
    }
}