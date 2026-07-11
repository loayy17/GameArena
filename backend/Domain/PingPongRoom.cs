using backend.Enums;
using System.Text.Json;

namespace backend.Domain
{
    public class PingPongRoom : BaseGameRoom
    {
        public PingPongRoom() : base(GamesKind.PingPong) { }
        // ball 
        public float BallPX { get; set; } = 0.5f; 
        public float BallPY { get; set; } = 0.5f;
        public float BallVX { get; set; } = 0.008f;
        public float BallVY { get; set; } = 0.006f;
        // paddles
        public float PadYP1 { get; set; } = 0.4f;
        public float PadHP1 { get; set; } = 0.2f;
        public float PadVP1 { get; set; } = 0.02f;
        public float PadYP2 { get; set; } = 0.4f;
        public float PadHP2 { get; set; } = 0.2f;
        public float PadVP2 { get; set; } = 0.02f;
        // score
        public int ScoreP1 { get; set; } = 0;
        public int ScoreP2 { get; set; } = 0;

        private const int WinScore = 5;
        private const float PaddleLeftEdge = 0.03f;
        private const float PaddleRightEdge = 0.97f;

        private void ResetBall()
        {
            BallPX = 0.5f;
            BallPY = 0.5f;
            var rng = new Random();
            BallVX = (rng.Next(2) == 0 ? 1f : -1f) * 0.008f;
            BallVY = (float)(rng.NextDouble() * 0.01 - 0.005);
        }

        public void Tick()
        {
            if (IsFinished || !HasStarted) return;

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
                    IsFinished = true;
                    WinnerPlayerId = Player1Id;
                    return;
                }
                ResetBall();
            }

            if (BallPX <= 0)
            {
                ScoreP2++;
                if (ScoreP2 >= WinScore)
                {
                    IsFinished = true;
                    WinnerPlayerId = Player2Id;
                    return;
                }
                ResetBall();
            }
        }

        public void TickBot()
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
            ballPosition = new { x = BallPX * 600, y = BallPY * 400 },
            player1PaddleY = PadYP1 * 400,
            player2PaddleY = PadYP2 * 400,
            player1Score = ScoreP1,
            player2Score = ScoreP2
        };

        public override void ProcessInput(string playerId, object action)
        {
            if(Player1Id != playerId && playerId != Player2Id) return;

            if (action is not JsonElement json
                || json.ValueKind != JsonValueKind.Object
                || !json.TryGetProperty("type", out var typeProp)
                || typeProp.GetString() != "MOVE_PADDLE"
                || !json.TryGetProperty("direction", out var directionProp))
                return;

            var direction = directionProp.GetString();
            if (playerId == Player1Id)
            {
                if (direction == "UP")
                    PadYP1 = Math.Max(0, PadYP1 - PadVP1);
                else if (direction == "DOWN")
                    PadYP1 = Math.Min(1 - PadHP1, PadYP1 + PadVP1);
            }
            else
            {
                if (direction == "UP")
                    PadYP2 = Math.Max(0, PadYP2 - PadVP2);
                else if (direction == "DOWN")
                    PadYP2 = Math.Min(1 - PadHP2, PadYP2 + PadVP2);
            }
        }
    }
}
