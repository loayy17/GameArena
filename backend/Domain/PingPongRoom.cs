using System.Text.Json;
using backend.Enums;
using backend.Utils;

namespace backend.Domain;

public class PingPongRoom : BaseGameRoom
{
    private const int WinScore = 5;
    private const int BoardWidthPx = 600;
    private const int BoardHeightPx = 400;
    private const int PaddleWidthPx = 12;
    private const int BallSizePx = 12;

    private const float PaddleMargin = 0.01f;
    private const float InitialBallSpeed = 0.012f;
    private const float BallHitSpeedRamp = 1.05f;
    private const float MaxBallSpeed = 0.03f;
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

    public PingPongRoom() : base(GamesKind.PingPong) { }

    public override bool NeedsGameLoop => true;

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

    protected override object GetStatePayloadCore()
    {
        var payload = GetBasePayload();
        payload["boardWidth"] = BoardWidthPx;
        payload["boardHeight"] = BoardHeightPx;
        payload["ball"] = new { x = BallPX * BoardWidthPx, y = BallPY * BoardHeightPx, vx = BallVX, vy = BallVY };
        payload["ballSize"] = BallSizePx;
        payload["player1Paddle"] = new { x = Paddle1Left * BoardWidthPx, y = PadYP1 * BoardHeightPx, height = PadHP1 * BoardHeightPx };
        payload["player2Paddle"] = new { x = Paddle2Left * BoardWidthPx, y = PadYP2 * BoardHeightPx, height = PadHP2 * BoardHeightPx };
        payload["paddleWidth"] = PaddleWidthPx;
        payload["player1Score"] = Score[0];
        payload["player2Score"] = Score[1];
        payload["winScore"] = WinScore;
        payload["tickRateHz"] = 1000 / TickIntervalMs;
        return payload;
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

    protected override void TickCore()
    {
        AdvanceBall();
        MakeBotMoveCore();
    }

    protected override void MakeBotMoveCore()
    {
        if (!IsBotGame || IsFinished || !HasStarted) return;

        bool botIsP1 = Player1Id == Constants.BotPlayerId;
        if (!botIsP1 && Player2Id != Constants.BotPlayerId) return;

        float paddleHeight = botIsP1 ? PadHP1 : PadHP2;
        float currentY = botIsP1 ? PadYP1 : PadYP2;

        bool ballComing = botIsP1 ? BallVX < 0 : BallVX > 0;
        float plane = botIsP1 ? BallContactPlane1 : BallContactPlane2;
        float targetY = ballComing ? PredictBallY(plane) - paddleHeight / 2f : 0.5f - paddleHeight / 2f;

        float moved = Math.Clamp(MoveToward(currentY, targetY, BotSpeed), 0, 1 - paddleHeight);

        if (botIsP1) PadYP1 = moved;
        else PadYP2 = moved;
    }

    private float BotSpeed => BotDifficulty switch
    {
        BotDifficulty.Easy => 0.011f,
        BotDifficulty.Hard => 0.026f,
        _ => 0.02f,
    };

    private float PredictBallY(float plane)
    {
        if (BotDifficulty == BotDifficulty.Easy)
            return BallPY;

        float timeToPlane = (plane - BallPX) / BallVX;
        float projected = BallPY + BallVY * timeToPlane;

        return BotDifficulty == BotDifficulty.Hard ? ReflectIntoBounds(projected) : projected;
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
            if (isPlayerOne) PadYP1 = Math.Clamp(targetY, 0, 1 - PadHP1);
            else PadYP2 = Math.Clamp(targetY, 0, 1 - PadHP2);

            return;
        }

        if (!typeProp.ValueEquals(ActionMovePaddle)
            || !action.TryGetProperty("direction", out var directionProp))
        {
            return;
        }

        bool isUp = directionProp.ValueEquals(DirectionUp);
        if (!isUp && !directionProp.ValueEquals(DirectionDown)) return;

        if (isPlayerOne) PadYP1 = Nudge(PadYP1, PadVP1, PadHP1, isUp);
        else PadYP2 = Nudge(PadYP2, PadVP2, PadHP2, isUp);
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

        if (BouncesOffPaddle1(previousX)) return;

        if (BouncesOffPaddle2(previousX)) return;

        ScoreMiss();
    }

    private bool BouncesOffPaddle1(float previousX)
    {
        if (BallVX >= 0 || previousX <= BallContactPlane1 || BallPX > BallContactPlane1) return false;

        if (BallPY < PadYP1 || BallPY > PadYP1 + PadHP1) return false;

        BallVX = Math.Min(Math.Abs(BallVX) * BallHitSpeedRamp, MaxBallSpeed);
        BallPX = BallContactPlane1;
        BallVY = DeflectFromPaddle1();
        return true;
    }

    private bool BouncesOffPaddle2(float previousX)
    {
        if (BallVX <= 0 || previousX >= BallContactPlane2 || BallPX < BallContactPlane2) return false;

        if (BallPY < PadYP2 || BallPY > PadYP2 + PadHP2) return false;

        BallVX = -Math.Min(Math.Abs(BallVX) * BallHitSpeedRamp, MaxBallSpeed);
        BallPX = BallContactPlane2;
        BallVY = DeflectFromPaddle2();
        return true;
    }

    private void ScoreMiss()
    {
        if (BallPX >= 1) ScorePoint(0);
        else if (BallPX <= 0)
        {
            ScorePoint(1);
        }
    }

    private void ScorePoint(int playerIndex)
    {
        Score[playerIndex]++;

        if (Score[playerIndex] < WinScore)
        {
            ResetBall();
            return;
        }

        CompleteRound(playerIndex == 0 ? Player1Id : Player2Id);
    }

    private float DeflectFromPaddle1() => ((BallPY - PadYP1) / PadHP1 - 0.5f) * 0.02f;

    private float DeflectFromPaddle2() => ((BallPY - PadYP2) / PadHP2 - 0.5f) * 0.02f;

    private void ResetBall()
    {
        BallPX = 0.5f;
        BallPY = 0.5f;
        BallVX = (Random.Shared.Next(2) == 0 ? 1f : -1f) * InitialBallSpeed;
        BallVY = (float)(Random.Shared.NextDouble() * 0.01 - 0.005);
    }

    private static float Nudge(float position, float velocity, float height, bool up) =>
        up ? Math.Max(0, position - velocity) : Math.Min(1 - height, position + velocity);

    private static float MoveToward(float current, float target, float maxStep)
    {
        float delta = target - current;

        if (Math.Abs(delta) < maxStep) return target;

        return current + Math.Sign(delta) * maxStep;
    }

    private static float ReflectIntoBounds(float y)
    {
        y = Math.Abs(y) % 2f;
        return y > 1f ? 2f - y : y;
    }
}
