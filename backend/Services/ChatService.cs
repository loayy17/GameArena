using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Events;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class ChatService(AppDbContext _context, IEventBus _eventBus) : IChatService
    {
        public async Task<List<MessageResponse>> GetMessagesAsync(Guid userId, Guid friendId)
        {
            await _context.Messages
                .Where(m => m.ReceiverId == userId && m.SenderId == friendId && !m.IsRead)
                .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.IsRead, true));

            var messages = await _context.Messages
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == friendId) ||
                    (m.SenderId == friendId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return messages.Select(MapperHelper.ToDto).ToList();
        }

        public async Task<Message> CreatePrivateMessageAsync(Guid senderId, Guid receiverId, string message)
        {
            var isFriend = await _context.UserFriends.AnyAsync(x => x.UserId == senderId && x.FriendId == receiverId);

            if (!isFriend) throw new AppException(ErrorCode.IsNotFriend);

            var msg = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = message,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();

            await _eventBus.PublishAsync(new ChatMessageSentEvent(senderId, receiverId, message, msg.SentAt));

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
            _context.Messages.Add(msg);
            await _context.SaveChangesAsync();

            return msg;
        }

        public async Task<int> GetUnreadMessagesCountAsync(Guid userId)
        {
            return await _context.Messages.CountAsync(m => m.ReceiverId == userId && m.IsRead == false);
        }
    }
}
