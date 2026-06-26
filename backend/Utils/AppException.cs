using backend.Enums;

namespace backend.Utils
{
    public class AppException : Exception
    {
        public ErrorCode ErrorCode { get; }

        public AppException(ErrorCode errorCode)
            : base(errorCode.ToString())
        {
            ErrorCode = errorCode;
        }
    }
}