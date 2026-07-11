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
            var friendRequests = await _friendService.GetFriendRequestCountAsync(userId);
            var friends = await _friendService.GetFriendCountAsync(userId);
            var unread = await _chatService.GetUnreadMessagesCountAsync(userId);

            return new NotificationCountersResponse
            {
                FriendRequests = friendRequests,
                Friends = friends,
                UnreadMessages = unread
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
            await SendCountersAsync(userId);
            await SendFriendsAsync(userId);
            await SendFriendRequestsAsync(userId);
            await SendBlockedAsync(userId);
        }
    }
}
