namespace backend.Enums
{
    public enum ErrorCode
    {
        None = 0,

        // Auth
        InvalidCredentials = 1001,
        Unauthorized = 1002,
        TokenExpired = 1003,
        EmailNotVerified = 1004,
        RefreshTokenInvalid = 1005,

        // Email verification
        OtpInvalid = 2001,
        OtpExpired = 2002,
        OtpAlreadyUsed = 2003,
        EmailNotFound = 2004,
        EmailAlreadyExists = 2005,

        // User
        UserNotFound = 3001,
        UserAlreadyExists = 3002,
        NoUsersFound = 3003,
        NoFriendsFound = 3004,

        // General
        ValidationError = 9001,
        ServerError = 9002
    }
}