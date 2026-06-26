using backend.Enums;

namespace backend.DTOs.Responses
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; } = true;
        public T? Data { get; set; } 
        public ErrorCode ErrorCode { get; set; } = ErrorCode.None;
        public string? Message { get; set; } = string.Empty;
    }
}
