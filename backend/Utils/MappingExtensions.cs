using System.Linq.Expressions;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Utils;

public static class MappingExtensions
{
    public static readonly Expression<Func<User, UserSummaryResponse>> ToSummaryProjection = u => new(
        u.Id,
        u.UserName,
        u.FirstName,
        u.LastName,
        u.FirstName + " " + u.LastName,
        UserStatus.Offline,
        AvatarUrl(u.Id, u.Avatar),
        u.Rank);

    public static readonly Expression<Func<User, AdminUserResponse>> ToAdminUser = u => new(
        u.Id,
        u.UserName,
        u.FirstName,
        u.LastName,
        u.FirstName + " " + u.LastName,
        u.Email,
        u.Role,
        u.IsBanned,
        UserStatus.Offline,
        AvatarUrl(u.Id, u.Avatar));

    public static readonly Expression<Func<Feedback, FeedbackResponse>> ToFeedbackItem = f => new()
    {
        Id = f.Id,
        Title = f.Title,
        Message = f.Message,
        Category = f.Category,
        CreatedAt = f.CreatedAt,
        UpdatedAt = f.UpdatedAt
    };

    public static string? AvatarUrl(Guid id, byte[]? avatar) =>
        avatar == null ? null : $"/api/user/{id}/avatar";

    public static UserResponse ToUserResponse(this User user, UserStatus status) => new()
    {
        Id = user.Id,
        UserName = user.UserName,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        FullName = user.FullName,
        Role = user.Role,
        Status = status,
        CreatedAt = user.CreatedAt,
        IsVerified = user.IsVerified,
        Preferences = user.Preferences,
        Rank = user.Rank,
        AvatarUrl = AvatarUrl(user.Id, user.Avatar),
        IsBanned = user.IsBanned
    };

    public static MessageResponse ToResponse(this Message message) => new()
    {
        Id = message.Id,
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

    public static FeedbackResponse ToResponse(this Feedback feedback) => new()
    {
        Id = feedback.Id,
        Title = feedback.Title,
        Message = feedback.Message,
        Category = feedback.Category,
        CreatedAt = feedback.CreatedAt,
        UpdatedAt = feedback.UpdatedAt
    };
}
