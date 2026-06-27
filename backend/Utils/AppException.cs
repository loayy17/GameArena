using backend.Enums;

namespace backend.Utils
{
    public class AppException(ErrorCode errorCode) : Exception(errorCode.ToString())
    {
        public ErrorCode ErrorCode { get; } = errorCode;
    }
}