using backend.Enums;

namespace backend.DTOs.Responses;

public sealed record FeedbackResponse
{
    public Guid Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public FeedbackCategory Category { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}