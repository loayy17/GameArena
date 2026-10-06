namespace backend.Utils;

public static class Constants
{
    public const string EmailPattern = @"^[^\s@]+@[^\s@]+\.[^\s@]+$";
    public const string PasswordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9\s])\S{8,64}$";
    public const int AvatarMaxBytes = 2 * 1024 * 1024;
    public const int OtpResendCooldownSeconds = 60;
    public const int OtpLifetimeMinutes = 15;
    public static readonly HashSet<string> AllowedAvatarTypes =
    [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif"
    ];

    public const string Access = "access_token";
    public const string Refresh = "refresh_token";

    public const int AccessTokenMinutes = 15;
    public const int RefreshTokenDays = 7;

    public const string BotPlayerId = "__BOT__";
    public const string BotPlayerName = "AI Bot";

    public const int DefaultTickMs = 50;

    public const int HistoryLimit = 500;
    public const int MaxMessageLength = 4000;
    public const int MessagePreviewLength = 50;

    public const int RecentMatchCount = 10;

    public const string DefaultSender = "noreply@gamearena.com";
    public const int MaxAttempts = 5;

    public const string ProtectedPrefix = "/api/public";
    public const string HeaderName = "X-Api-Key";

    public const int DefaultLimit = 10;
    public const int MaxLimit = 100;

    public const string StaffRoles = "Admin,Moderator,SuperAdmin";
    public const string RoleAdmins = "Admin,SuperAdmin";

    public const int SnakeBoardWidth = 30;
    public const int SnakeBoardHeight = 20;
    public const int SnakeInitialLength = 3;
    public const int SnakeGameTickIntervalMs = 100;
    public const int SnakeRandomSpawnAttempts = 100;
    public const int SnakeFoodScore = 1000;
    public const int SnakeWallScorePerCell = 2;
    public const int SnakeEscapeWeight = 5;
    public const string SnakeActionChangeDirection = "CHANGE_DIRECTION";

    public const string RockPaperScissorsActionMakeMove = "MAKE_MOVE";

    public const int PingPongWinScore = 5;
    public const int PingPongBoardWidthPx = 600;
    public const int PingPongBoardHeightPx = 400;
    public const int PingPongPaddleWidthPx = 12;
    public const int PingPongBallSizePx = 12;
    public const float PingPongPaddleMargin = 0.01f;
    public const float PingPongInitialBallSpeed = 0.012f;
    public const float PingPongBallHitSpeedRamp = 1.05f;
    public const float PingPongMaxBallSpeed = 0.03f;
    public const float PingPongPaddleWidth = (float)PingPongPaddleWidthPx / PingPongBoardWidthPx;
    public const float PingPongBallRadius = PingPongBallSizePx / (2f * PingPongBoardWidthPx);
    public const float PingPongPaddle1Left = PingPongPaddleMargin;
    public const float PingPongPaddle1Right = PingPongPaddleMargin + PingPongPaddleWidth;
    public const float PingPongPaddle2Right = 1f - PingPongPaddleMargin;
    public const float PingPongPaddle2Left = PingPongPaddle2Right - PingPongPaddleWidth;
    public const float PingPongBallContactPlane1 = PingPongPaddle1Right - PingPongBallRadius;
    public const float PingPongBallContactPlane2 = PingPongPaddle2Left + PingPongBallRadius;
    public const string PingPongActionMovePaddle = "MOVE_PADDLE";
    public const string PingPongActionSetPaddle = "SET_PADDLE";
    public const string PingPongDirectionUp = "UP";
    public const string PingPongDirectionDown = "DOWN";

    public const int ConnectFourCols = 7;
    public const int ConnectFourRows = 6;
    public const int ConnectFourCenterCol = 3;
    public const int ConnectFourWinValue = 1_000_000;
    public const int ConnectFourDefaultDepth = 5;
    public const string ConnectFourActionPlace = "place";
    public const int ConnectFourFirstPiece = 1;
    public const int ConnectFourSecondPiece = 2;

    public const int TicTacToeWinScore = 10;
    public const string TicTacToeEmptyCell = ".";
    public const string TicTacToeActionMakeMove = "MAKE_MOVE";
}
