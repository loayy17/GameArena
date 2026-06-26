using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;

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
                CreatedAt = user.CreatedAt,
                IsVerified = user.IsVerified
            };
        }
        public static FriendResponse ToDto(FriendRequest friendship)
        {
            return new FriendResponse
            {
                SenderId = friendship.SenderId,
                SenderFirstName = friendship.Sender.FirstName,
                SenderLastName = friendship.Sender.LastName,
                SenderUserName = friendship.Sender.UserName,
                SentAt = friendship.CreatedAt
            };
        }
        public static SentResponse ToDtoSend(FriendRequest friendship)
        {
            return new SentResponse
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
       
    }
}
