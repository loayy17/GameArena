using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Events;
using backend.Hubs;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ChatService(
    AppDbContext context,
    IEventBus eventBus,
    INotificationService notifications,
    IHubContext<SocialHub> hub) : IChatService
{
    public async Task<List<MessageResponse>> GetMessagesAsync(Guid userId, Guid friendId)
    {
        var markedRead = await context.Messages
            .Where(m => m.ReceiverId == userId && m.SenderId == friendId && !m.IsRead)
            .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.IsRead, true));

        if (markedRead > 0)
        {
            await notifications.SendCountersAsync(userId);
            await hub.Clients.Group($"user:{friendId}").SendAsync("chat:read", new { readerId = userId, senderId = friendId });
        }

        await notifications.DeleteNotificationsByReferenceAsync(userId, NotificationType.NewMessage, friendId.ToString());

        var messages = await context.Messages
            .AsNoTracking()
            .Where(m =>
                (m.SenderId == userId && m.ReceiverId == friendId) ||
                (m.SenderId == friendId && m.ReceiverId == userId))
            .OrderByDescending(m => m.SentAt)
            .Take(Constants.HistoryLimit)
            .ToListAsync();

        return [.. messages.OrderBy(m => m.SentAt).Select(m => m.ToResponse())];
    }

    public async Task<MessageResponse> CreatePrivateMessageAsync(Guid senderId, Guid receiverId, string message)
    {
        if (await SocialQueryHelper.GetBlockerAsync(context, senderId, receiverId) != null) throw new AppException(ErrorCode.UserBlockedYou);

        if (!await SocialQueryHelper.AreFriendsAsync(context, senderId, receiverId)) throw new AppException(ErrorCode.IsNotFriend);

        var content = message.Trim();
        if (content.Length == 0 || content.Length > Constants.MaxMessageLength) throw new AppException(ErrorCode.ValidationError);

        var entity = new Message
        {
            SenderId = senderId,
            ReceiverId = receiverId,
            Content = content,
            SentAt = DateTime.UtcNow
        };

        context.Messages.Add(entity);
        await context.SaveChangesAsync();

        _ = eventBus.PublishAsync(new ChatMessageSentEvent(senderId, receiverId, content, entity.SentAt));

        return entity.ToResponse();
    }

    public async Task<List<PerFriendUnreadCountResponse>> GetUnreadCountsPerFriendAsync(Guid userId)
    {
        return await context.Messages
            .Where(m => m.ReceiverId == userId && !m.IsRead)
            .GroupBy(m => m.SenderId)
            .Select(g => new PerFriendUnreadCountResponse(g.Key, g.Count()))
            .ToListAsync();
    }
}
