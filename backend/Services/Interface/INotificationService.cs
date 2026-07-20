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

        Task<List<NotificationResponse>> GetNotificationsAsync(Guid userId, int limit = 50);
        Task<NotificationResponse> CreateNotificationAsync(Guid userId, string type, string title, string body, string? referenceId = null);
        Task MarkNotificationAsReadAsync(Guid userId, Guid notificationId);
        Task MarkAllNotificationsAsReadAsync(Guid userId);
        Task DeleteNotificationAsync(Guid userId, Guid notificationId);
    }
}
