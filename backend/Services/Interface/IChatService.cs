using backend.DTOs.Responses;

namespace backend.Services.Interface;

public interface IChatService
{
    Task<List<MessageResponse>> GetMessagesAsync(Guid userId, Guid friendId);
    Task<MessageResponse> CreatePrivateMessageAsync(Guid senderId, Guid receiverId, string message);
    Task<List<PerFriendUnreadCountResponse>> GetUnreadCountsPerFriendAsync(Guid userId);
}
