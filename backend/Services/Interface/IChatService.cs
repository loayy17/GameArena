using backend.Domain;
using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface IChatService
    {
        Task<List<MessageResponse>> GetMessagesAsync(Guid userId, Guid friendId);
        Task<Message> CreatePrivateMessageAsync(Guid senderId, Guid receiverId, string message);
        Task<Message> CreateGlobalMessageAsync(Guid senderId, string message);
        Task<int> GetUnreadMessagesCountAsync(Guid userId);

    }
}