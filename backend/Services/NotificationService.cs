using backend.DTOs.Responses;
using backend.Hubs;
using backend.Services.Interface;
using Microsoft.AspNetCore.SignalR;

namespace backend.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<SocialHub> _hub;
        private readonly IFriendService _friendService;
        private readonly IChatService _chatService;

        public NotificationService(
            IHubContext<SocialHub> hub,
            IFriendService friendService,
            IChatService chatService)
        {
            _hub = hub;
            _friendService = friendService;
            _chatService = chatService;
        }

        public async Task<NotificationCountersResponse> GetCountersAsync(Guid userId)
        {
            var friendRequestsTask = _friendService.GetFriendRequestCountAsync(userId);
            var friendsTask = _friendService.GetFriendCountAsync(userId);
            var unreadTask = _chatService.GetUnreadMessagesCountAsync(userId);

            await Task.WhenAll(friendRequestsTask, friendsTask, unreadTask);

            return new NotificationCountersResponse
            {
                FriendRequests = friendRequestsTask.Result,
                Friends = friendsTask.Result,
                UnreadMessages = unreadTask.Result
            };
        }

        public async Task SendCountersAsync(Guid userId)
        {
            var counters = await GetCountersAsync(userId);

            await _hub.Clients
                .Group($"user:{userId}")
                .SendAsync("notification:update", counters);
        }

        public async Task SendFriendsAsync(Guid userId)
        {
            var friends = await _friendService.GetFriendsAsync(userId, null);
            await _hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:friends", friends);
        }

        public async Task SendFriendRequestsAsync(Guid userId)
        {
            var received = await _friendService.GetReceivedRequestsAsync(userId);
            var sent = await _friendService.GetSentRequestsAsync(userId);
            await _hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:requests", new { received, sent });
        }

        public async Task SendBlockedAsync(Guid userId)
        {
            var blocked = await _friendService.GetBlockedUsersAsync(userId);
            await _hub.Clients
                .Group($"user:{userId}")
                .SendAsync("social:blocked", blocked);
        }

        public async Task SendSocialDataAsync(Guid userId)
        {
            await Task.WhenAll(
                SendCountersAsync(userId),
                SendFriendsAsync(userId),
                SendFriendRequestsAsync(userId),
                SendBlockedAsync(userId)
            );
        }
    }
}
