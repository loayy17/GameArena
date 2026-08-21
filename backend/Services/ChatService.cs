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
    public class ChatService(AppDbContext _context, IEventBus _eventBus, INotificationService _notificationService) : IChatService
    {
        public async Task<List<MessageResponse>> GetMessagesAsync(Guid userId, Guid friendId)
        {
            var unreadCount = await _context.Messages
                .Where(m => m.ReceiverId == userId && m.SenderId == friendId && !m.IsRead)
                .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.IsRead, true));

            if (unreadCount > 0)
                await _notificationService.SendCountersAsync(userId);

            var messages = await _context.Messages
                .AsNoTracking()
                .Where(m =>
                    (m.SenderId == userId && m.ReceiverId == friendId) ||
                    (m.SenderId == friendId && m.ReceiverId == userId))
                .OrderBy(m => m.SentAt)
                .Select(m => new MessageResponse
                {
                    SenderId = m.SenderId,
                    ReceiverId = m.ReceiverId,
                    Content = m.Content,
                    SentAt = m.SentAt,
                    IsRead = m.IsRead
                })
                .ToListAsync();

            return messages;
        }

        public async Task<MessageResponse> CreatePrivateMessageAsync(Guid senderId, Guid receiverId, string message)
        {
            if (await SocialQueryHelper.GetBlockerAsync(_context, senderId, receiverId) != null)
                throw new AppException(ErrorCode.UserBlockedYou);

            if (!await SocialQueryHelper.AreFriendsAsync(_context, senderId, receiverId))
                throw new AppException(ErrorCode.IsNotFriend);

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

            return msg.ToResponse();
        }

        public async Task<List<PerFriendUnreadCountResponse>> GetUnreadCountsPerFriendAsync(Guid userId)
        {
            return await _context.Messages
                .Where(m => m.ReceiverId == userId && !m.IsRead)
                .GroupBy(m => m.SenderId)
                .Select(g => new PerFriendUnreadCountResponse(g.Key, g.Count()))
                .ToListAsync();
        }
    }
}