using backend.Enums;
using System.Text.Json;

namespace backend.Domain
{
    public class PingPongRoom : BaseGameRoom
    {
        public PingPongRoom() : base(GamesKind.PingPong) { }

        public float BallPX { get; set; } = 0.5f;
        public float BallPY { get; set; } = 0.5f;
        public float BallVX { get; set; } = InitialBallSpeed;
        public float BallVY { get; set; } = 0.006f;

        public float PadYP1 { get; set; } = 0.4f;
        public float PadHP1 { get; set; } = 0.2f;
        public float PadVP1 { get; set; } = 0.035f;
        public float PadYP2 { get; set; } = 0.4f;
        public float PadHP2 { get; set; } = 0.2f;
        public float PadVP2 { get; set; } = 0.035f;

        private const int WinScore = 5;
        private const float PaddleMargin = 0.01f;
        private const float InitialBallSpeed = 0.012f;
        private const float BallHitSpeedRamp = 1.05f;
        private const float MaxBallSpeed = 0.03f;
        private const int PaddleWidthPx = 12;
        private const int BallSizePx = 12;
        private const float PaddleWidth = (float)PaddleWidthPx / BoardWidthPx;
        private const float BallRadius = BallSizePx / (2f * BoardWidthPx);
        private const float Paddle1Left = PaddleMargin;
        private const float Paddle1Right = PaddleMargin + PaddleWidth;
        private const float Paddle2Right = 1f - PaddleMargin;
        private const float Paddle2Left = Paddle2Right - PaddleWidth;
        private const float BallContactPlane1 = Paddle1Right - BallRadius;
        private const float BallContactPlane2 = Paddle2Left + BallRadius;

        private const string ActionMovePaddle = "MOVE_PADDLE";
        private const string ActionSetPaddle = "SET_PADDLE";
        private const string DirectionUp = "UP";
        private const string DirectionDown = "DOWN";


        private const int BoardWidthPx = 600;
        private const int BoardHeightPx = 400;

        private void ResetBall()
        {
            BallPX = 0.5f;
            BallPY = 0.5f;
            BallVX = (Random.Shared.Next(2) == 0 ? 1f : -1f) * InitialBallSpeed;
            BallVY = (float)(Random.Shared.NextDouble() * 0.01 - 0.005);
        }

        public override bool NeedsGameLoop => true;

        protected override void TickCore()
        {
            AdvanceBall();
            MakeBotMoveCore();
        }

        private void AdvanceBall()
        {
            if (WinnerPlayerId != null || !HasStarted) return;

            float previousX = BallPX;
            BallPX += BallVX;
            BallPY += BallVY;

            if (BallPY <= 0 || BallPY >= 1)
            {
                BallVY = -BallVY;
                BallPY = Math.Clamp(BallPY, BallRadius, 1f - BallRadius);
            }

            float paddleTop1 = PadYP1;
            float paddleBottom1 = PadYP1 + PadHP1;
            if (BallVX < 0 && previousX > BallContactPlane1 && BallPX <= BallContactPlane1 && BallPY >= paddleTop1 && BallPY <= paddleBottom1)
            {
                BallVX = Math.Min(Math.Abs(BallVX) * BallHitSpeedRamp, MaxBallSpeed);
                BallPX = BallContactPlane1;
                float hitPos = (BallPY - PadYP1) / PadHP1;
                BallVY = (hitPos - 0.5f) * 0.02f;
            }

            float paddleTop2 = PadYP2;
            float paddleBottom2 = PadYP2 + PadHP2;
            if (BallVX > 0 && previousX < BallContactPlane2 && BallPX >= BallContactPlane2 && BallPY >= paddleTop2 && BallPY <= paddleBottom2)
            {
                BallVX = -Math.Min(Math.Abs(BallVX) * BallHitSpeedRamp, MaxBallSpeed);
                BallPX = BallContactPlane2;
                float hitPos = (BallPY - PadYP2) / PadHP2;
                BallVY = (hitPos - 0.5f) * 0.02f;
            }

            if (BallPX >= 1)
            {
                Score[0]++;
                if (Score[0] >= WinScore)
                {
                    CompleteRound(Player1Id);
                    return;
                }
                ResetBall();
            }

            if (BallPX <= 0)
            {
                Score[1]++;
                if (Score[1] >= WinScore)
                {
                    CompleteRound(Player2Id);
                    return;
                }
                ResetBall();
            }
        }

        protected override void MakeBotMoveCore()
        {
            if (!IsBotGame || IsFinished || !HasStarted) return;

            bool botIsP1 = Player1Id == "__BOT__";
            bool botIsP2 = Player2Id == "__BOT__";
            if (!botIsP1 && !botIsP2) return;

            float botPaddleY = botIsP1 ? PadYP1 : PadYP2;
            float paddleHeight = botIsP1 ? PadHP1 : PadHP2;

            float targetY;
            bool ballComing = botIsP1 ? BallVX < 0 : BallVX > 0;
            if (ballComing)
            {
                float plane = botIsP1 ? BallContactPlane1 : BallContactPlane2;
                float timeToPlane = (plane - BallPX) / BallVX;
                float predictedBallY = BallPY + BallVY * timeToPlane;
                targetY = predictedBallY - paddleHeight / 2f;
            }
            else
            {
                targetY = 0.5f - paddleHeight / 2f;
            }

            const float speed = 0.02f;

            float diff = targetY - botPaddleY;
            if (Math.Abs(diff) < speed)
                botPaddleY = targetY;
            else if (diff > 0)
                botPaddleY += speed;
            else
                botPaddleY -= speed;

            botPaddleY = Math.Clamp(botPaddleY, 0, 1 - paddleHeight);

            if (botIsP1)
                PadYP1 = botPaddleY;
            else
                PadYP2 = botPaddleY;
        }

        protected override object GetStatePayloadCore()
        {
            var p = GetBasePayload();
            p["boardWidth"] = BoardWidthPx;
            p["boardHeight"] = BoardHeightPx;
            p["ball"] = new { x = BallPX * BoardWidthPx, y = BallPY * BoardHeightPx, vx = BallVX, vy = BallVY };
            p["ballSize"] = BallSizePx;
            p["player1Paddle"] = new { x = Paddle1Left * BoardWidthPx, y = PadYP1 * BoardHeightPx, height = PadHP1 * BoardHeightPx };
            p["player2Paddle"] = new { x = Paddle2Left * BoardWidthPx, y = PadYP2 * BoardHeightPx, height = PadHP2 * BoardHeightPx };
            p["paddleWidth"] = PaddleWidthPx;
            p["player1Score"] = Score[0];
            p["player2Score"] = Score[1];
            p["winScore"] = WinScore;
            p["tickRateHz"] = 1000 / TickIntervalMs;
            return p;
        }

        protected override void ResetForNewRoundCore()
        {
            base.ResetForNewRoundCore();
            Score[0] = 0;
            Score[1] = 0;
            PadYP1 = 0.4f;
            PadHP1 = 0.2f;
            PadVP1 = 0.035f;
            PadYP2 = 0.4f;
            PadHP2 = 0.2f;
            PadVP2 = 0.035f;
            ResetBall();
        }

        protected override void HandleActionCore(string playerId, JsonElement action)
        {
            if (Player1Id != playerId && Player2Id != playerId) return;

            if (action.ValueKind != JsonValueKind.Object
                || !action.TryGetProperty("type", out var typeProp))
                return;

            bool isPlayerOne = playerId == Player1Id;

            if (typeProp.ValueEquals(ActionSetPaddle)
                && action.TryGetProperty("y", out var yProp)
                && yProp.TryGetSingle(out var targetY))
            {
                if (isPlayerOne)
                    PadYP1 = Math.Clamp(targetY, 0, 1 - PadHP1);
                else
                    PadYP2 = Math.Clamp(targetY, 0, 1 - PadHP2);
                return;
            }

            if (!typeProp.ValueEquals(ActionMovePaddle)
                || !action.TryGetProperty("direction", out var directionProp))
                return;

            bool isUp = directionProp.ValueEquals(DirectionUp);
            if (!isUp && !directionProp.ValueEquals(DirectionDown)) return;

            if (isPlayerOne)
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
