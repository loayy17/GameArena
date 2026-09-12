using backend.DTOs.Responses;
using backend.Enums;

using System.Collections.Frozen;

namespace backend.Utils
{

    public static class ErrorHelper
    {
        private static readonly FrozenDictionary<ErrorCode, int> Errors = new Dictionary<ErrorCode, int>
        {
            [ErrorCode.InvalidCredentials] = 401,
            [ErrorCode.Unauthorized] = 401,
            [ErrorCode.TokenExpired] = 401,
            [ErrorCode.EmailNotVerified] = 401,
            [ErrorCode.RefreshTokenInvalid] = 401,
            [ErrorCode.UserBanned] = 403,
            [ErrorCode.Forbidden] = 403,
            [ErrorCode.EmailAlreadyVerified] = 400,
            [ErrorCode.EmailNotFound] = 404,
            [ErrorCode.EmailAlreadyExists] = 409,
            [ErrorCode.UsernameAlreadyExists] = 409,
            [ErrorCode.OtpInvalid] = 400,
            [ErrorCode.OtpExpired] = 400,
            [ErrorCode.RateLimited] = 429,
            [ErrorCode.UserNotFound] = 404,
            [ErrorCode.AlreadyBlocked] = 400,
            [ErrorCode.NotBlocked] = 400,
            [ErrorCode.CannotSelfBlock] = 400,
            [ErrorCode.UserBlockedYou] = 403,
            [ErrorCode.YouBlockedUser] = 403,
            [ErrorCode.RequestAlreadyExists] = 409,
            [ErrorCode.AlreadyFriends] = 409,
            [ErrorCode.ReceiverHasAlreadySentRequest] = 409,
            [ErrorCode.FriendRequestNotFound] = 404,
            [ErrorCode.IsNotFriend] = 400,
            [ErrorCode.RequestAlreadyProcessed] = 409,
            [ErrorCode.RoomNotFound] = 404,
            [ErrorCode.PlayerNotFound] = 404,
            [ErrorCode.InvalidGameType] = 400,
            [ErrorCode.InvalidRoomId] = 400,
            [ErrorCode.InvalidRequest] = 400,
            [ErrorCode.ValidationError] = 400,
            [ErrorCode.ServerError] = 500,
            [ErrorCode.None] = 500
        }.ToFrozenDictionary();

        public static ErrorResponse GetErrorResponse(Exception ex)
        {
            if (ex is not AppException appEx) return Create(500, ErrorCode.ServerError);
            return Errors.TryGetValue(appEx.ErrorCode, out var statusCode)
                ? Create(statusCode, appEx.ErrorCode)
                : Create(500, ErrorCode.ServerError);
        }

        private static ErrorResponse Create(int statusCode, ErrorCode code) => new(
            statusCode,
            new ApiResponse<object>
            {
                Success = false,
                ErrorCode = code,
                Data = null
            }
        );
    }

    public sealed record ErrorResponse(int StatusCode, ApiResponse<object> Value);

}
