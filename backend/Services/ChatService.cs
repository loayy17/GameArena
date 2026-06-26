using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ChatService(AppDbContext context) : IChatService
    {
        public async Task<List<MessageResponse>> GetMessagesAsync(Guid userId, Guid friendId)
        {
            return await context.Messages
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == friendId) ||
                    (m.SenderId == friendId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .Select(m => MapperHelper.ToDto(m))
                .ToListAsync();
        }

        public async Task<Message> CreatePrivateMessageAsync(Guid senderId, Guid receiverId, string message)
        {
            var isFriend = await context.UserFriends.AnyAsync(x => x.UserId == senderId && x.FriendId == receiverId);

            if (!isFriend) throw new AppException(ErrorCode.IsNotFriend);

            var msg = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = message,
                SentAt = DateTime.UtcNow
            };

            context.Messages.Add(msg);
            await context.SaveChangesAsync();

            return msg;
        }

        public async Task<Message> CreateGlobalMessageAsync(Guid senderId, string message)
        {
            var msg = new Message
            {
                SenderId = senderId,
                Content = message,
                SentAt = DateTime.UtcNow
            };

            context.Messages.Add(msg);
            await context.SaveChangesAsync();

            return msg;
        }

    }
}