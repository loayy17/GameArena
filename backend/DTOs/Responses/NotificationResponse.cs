using backend.Enums;

namespace backend.DTOs.Responses;

public sealed record NotificationResponse
{
    public Guid Id { get; init; }
    public NotificationType Type { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Body { get; init; } = string.Empty;
    public string? ReferenceId { get; init; }
    public bool IsRead { get; init; }
    public DateTime CreatedAt { get; init; }
}
