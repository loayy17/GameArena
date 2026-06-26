using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Utils
{
    public interface IErrorResponse
    {
        ApiResponse<object> value { get; set; }
        int StatusCode { get; set; }
    }

    public class ErrorResponse : IErrorResponse
    {
        public ApiResponse<object> value { get; set; } = null!;
        public int StatusCode { get; set; }
    }
    public record ErrorDefinition(
        int StatusCode,
        string Message
    );

    public static class ErrorHelper
    {
        public static readonly IDictionary<ErrorCode, (int StatusCode, string Message)> Errors =
         new Dictionary<ErrorCode, (int StatusCode, string Message)>
         {
             // AUTH

             [ErrorCode.InvalidCredentials] =
             (401, "Invalid credentials"),

             [ErrorCode.Unauthorized] =
             (401, "Unauthorized access"),

             [ErrorCode.TokenExpired] =
             (401, "Token has expired"),

             [ErrorCode.EmailNotVerified] =
             (401, "Email is not verified"),

             [ErrorCode.RefreshTokenInvalid] =
             (401, "Invalid refresh token"),

             [ErrorCode.EmailAlreadyVerified] =
             (400, "Email is already verified"),

             // EMAIL / OTP

             [ErrorCode.EmailNotFound] =
             (404, "Email not found"),

             [ErrorCode.EmailAlreadyExists] =
             (409, "Email already exists"),

             [ErrorCode.OtpInvalid] =
             (400, "Invalid OTP"),

             [ErrorCode.OtpExpired] =
             (400, "OTP has expired"),

             [ErrorCode.OtpAlreadyUsed] =
             (400, "OTP already used"),
             [ErrorCode.OtpGenerationFailed] =
             (500, "Failed to generate OTP"),

             // USER

             [ErrorCode.UserNotFound] =
             (404, "User not found"),

             [ErrorCode.UserAlreadyExists] =
             (409, "User already exists"),

             [ErrorCode.NoUsersFound] =
             (404, "No users found"),

             [ErrorCode.NoFriendsFound] =
             (404, "No friends found"),

             // FRIEND SYSTEM

             [ErrorCode.RequestAlreadyExists] =
             (409, "Friend request already exists"),

             [ErrorCode.AlreadyFriends] =
             (409, "Users are already friends"),

             [ErrorCode.ReceiverHasAlreadySentRequest] =
             (409, "Receiver has already sent a friend request"),

             [ErrorCode.FriendRequestNotFound] =
             (404, "Friend request not found"),

             [ErrorCode.IsNotFriend] =
             (400, "Users are not friends"),

             // GAME

             [ErrorCode.RoomNotFound] =
             (404, "Game room not found"),

             [ErrorCode.PlayerNotFound] =
             (404, "Player not found"),

             [ErrorCode.MatchSaveFailed] =
             (500, "Failed to save match history"),

             [ErrorCode.InvalidGameType] =
             (400, "Invalid game type"),

             [ErrorCode.InvalidRoomId] =
             (400, "Invalid room ID"),

             // VALIDATION / REQUEST

             [ErrorCode.InvalidRequest] =
             (400, "Invalid request"),

             [ErrorCode.ValidationError] =
             (400, "Validation failed"),

             // SYSTEM

             [ErrorCode.ServerError] =
             (500, "Internal server error"),

             [ErrorCode.None] =
             (500, "Unknown error")
         };
        public static IErrorResponse GetErrorResponse(Exception ex)
        {
            if (ex is not AppException appEx)
            {
                return Create(
                    500,
                    ErrorCode.ServerError,
                    "Internal server error"
                );
            }

            if (!Errors.TryGetValue(appEx.ErrorCode, out var definition))
            {
                throw new Exception($"Missing ErrorCode mapping: {appEx.ErrorCode}");
            }

            return Create(
                definition.StatusCode,
                appEx.ErrorCode,
                definition.Message
            );
        }

        private static ErrorResponse Create(
            int statusCode,
            ErrorCode code,
            string message)
        {
            return new ErrorResponse
            {
                StatusCode = statusCode,
                value = new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = code,
                    Message = message,
                    Data = null
                }
            };
        }
    }
}