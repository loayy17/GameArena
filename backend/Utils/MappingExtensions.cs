using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Utils;

public static class MappingExtensions
{
    public static UserResponse ToResponse(this User user) => new()
    {
        Id = user.Id,
        UserName = user.UserName,
        Email = user.Email,
        FirstName = user.FirstName,
        LastName = user.LastName,
        Role = user.Role,
        Status = user.Status,
        CreatedAt = user.CreatedAt,
        IsVerified = user.IsVerified,
        Preferences = user.Preferences,
        AvatarUrl = user.AvatarUrl
    };

    public static UserSummaryResponse ToSummaryResponse(this User user)
        => new(user.Id, user.UserName, user.FirstName, user.LastName, user.Status, user.AvatarUrl);

    public static FriendRequestReceivedResponse ToReceivedRequestResponse(this FriendRequest friendship) => new()
    {
        SenderId = friendship.SenderId,
        SenderFirstName = friendship.Sender.FirstName,
        SenderLastName = friendship.Sender.LastName,
        SenderUserName = friendship.Sender.UserName,
        SentAt = friendship.CreatedAt
    };

    public static FriendRequestSentResponse ToSentRequestResponse(this FriendRequest friendship) => new()
    {
        ReceiverId = friendship.ReceiverId,
        ReceiverFirstName = friendship.Receiver.FirstName,
        ReceiverLastName = friendship.Receiver.LastName,
        ReceiverUserName = friendship.Receiver.UserName,
        SentAt = friendship.CreatedAt
    };

    public static MessageResponse ToResponse(this Message message) => new()
    {
        SenderId = message.SenderId,
        ReceiverId = message.ReceiverId,
        Content = message.Content,
        SentAt = message.SentAt,
        IsRead = message.IsRead
    };

    public static MatchHistoryResponse ToResponse(this MatchHistory matchHistory, Guid userId)
    {
        var opponent = matchHistory.Player1Id == userId
            ? matchHistory.Player2
            : matchHistory.Player1;

        var isP1 = matchHistory.Player1Id == userId;
        var myScore = isP1 ? matchHistory.Player1Score : matchHistory.Player2Score;
        var opponentScore = isP1 ? matchHistory.Player2Score : matchHistory.Player1Score;

        return new MatchHistoryResponse
        {
            Id = matchHistory.Id,
            Kind = matchHistory.GameType,
            CompletedAt = matchHistory.CompletedAt,
            Opponent = opponent.ToSummaryResponse(),
            Player1Score = matchHistory.Player1Score,
            Player2Score = matchHistory.Player2Score,
            Result = myScore > opponentScore
                ? MatchStatus.Win
                : myScore < opponentScore
                    ? MatchStatus.Lost
                    : MatchStatus.Draw
        };
    }

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