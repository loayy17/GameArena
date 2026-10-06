using backend.Enums;

namespace backend.DTOs.Responses;

public sealed record ApiResponse<T>
{
    public bool Success { get; init; } = true;
    public T? Data { get; init; }
    public ErrorCode ErrorCode { get; init; } = ErrorCode.None;
}
