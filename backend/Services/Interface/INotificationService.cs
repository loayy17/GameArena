using backend.DTOs.Responses;

namespace backend.Services.Interface
{
    public interface INotificationService
    {
        Task<NotificationCountersResponse> GetCountersAsync(Guid userId);
        Task SendCountersAsync(Guid userId);
        Task SendFriendsAsync(Guid userId);
        Task SendFriendRequestsAsync(Guid userId);
        Task SendBlockedAsync(Guid userId);
        Task SendSocialDataAsync(Guid userId);
    }
}
