using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Utils
{
    public  static class MapperHelper
    {
        public static UserResponse ToDto(User user)
        {
            return new UserResponse
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
                Preferences = user.Preferences
            };
        }
        public static UserSummaryResponse ToDtoSummary(UserResponse user)
        {
            return new UserSummaryResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Status = user.Status
            };
        }
        public static UserSummaryResponse ToDtoSummary(User user)
        {
            return new UserSummaryResponse
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Status = user.Status
            };
        }
        public static FriendRequestReceivedResponse ToDto(FriendRequest friendship)
        {
            return new FriendRequestReceivedResponse
            {
                SenderId = friendship.SenderId,
                SenderFirstName = friendship.Sender.FirstName,
                SenderLastName = friendship.Sender.LastName,
                SenderUserName = friendship.Sender.UserName,
                SentAt = friendship.CreatedAt
            };
        }
        public static FriendRequestSentResponse ToSentRequestDto(FriendRequest friendship)
        {
            return new FriendRequestSentResponse
            {
                ReceiverId = friendship.ReceiverId,
                ReceiverFirstName = friendship.Receiver.FirstName,
                ReceiverLastName = friendship.Receiver.LastName,
                ReceiverUserName = friendship.Receiver.UserName,
                SentAt = friendship.CreatedAt
            };
        }
        public static MessageResponse ToDto(Message message)
        {
            return new MessageResponse
            {
                SenderId = message.SenderId,
                ReceiverId = message.ReceiverId,
                Content = message.Content,
                SentAt = message.SentAt,
                IsRead = message.IsRead
            };
        }
        public static MatchHistoryResponse ToDto(MatchHistory matchHistory, Guid userId)
        {
            var opponent = matchHistory.Player1Id == userId
                ? matchHistory.Player2
                : matchHistory.Player1;

            return new MatchHistoryResponse
            {
                Id = matchHistory.Id,
                Kind = matchHistory.GameType,
                CompletedAt = matchHistory.CompletedAt,
                Opponent = ToDtoSummary(opponent),
                IsWinner = matchHistory.WinnerId == userId,
                Result = matchHistory.WinnerId == null
                    ? MatchStatus.Draw
                    : (matchHistory.WinnerId == userId ? MatchStatus.Win : MatchStatus.Lost)
            };
        }
       
    }
}
