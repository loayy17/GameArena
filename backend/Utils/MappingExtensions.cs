using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;

namespace backend.Utils;

public static class MappingExtensions
{
    public static string? AvatarUrl(Guid id, byte[]? avatar)
        => avatar == null ? null : $"/api/user/{id}/avatar";

    public static UserResponse ToDto(this User user, IUserPresenceService presence) => new()
    {
        Id = user.Id,
        UserName = user.UserName,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Role = user.Role,
        Status = presence.GetStatus(user.Id.ToString()),
        CreatedAt = user.CreatedAt,
        IsVerified = user.IsVerified,
        Preferences = user.Preferences,
        Rank = user.Rank,
        AvatarUrl = AvatarUrl(user.Id, user.Avatar)
    };

    public static UserSummaryResponse ToSummaryResponse(this User user)
        => new(user.Id, user.UserName, user.FirstName, user.LastName, user.Status, AvatarUrl(user.Id, user.Avatar));

    public static MessageResponse ToResponse(this Message message) => new()
    {
        SenderId = message.SenderId,
        ReceiverId = message.ReceiverId,
        Content = message.Content,
        SentAt = message.SentAt,
        IsRead = message.IsRead
    };

    public static NotificationResponse ToResponse(this Notification notification) => new()
    {
        Id = notification.Id,
        Type = notification.Type,
        Title = notification.Title,
        Body = notification.Body,
        ReferenceId = notification.ReferenceId,
        IsRead = notification.IsRead,
        CreatedAt = notification.CreatedAt
    };
}