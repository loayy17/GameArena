using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    [Authorize]
    public class ChatHub(IChatService _chatService) : Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = GetUserId();
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user:{userId}");
            await Groups.AddToGroupAsync(Context.ConnectionId, "GlobalChat");
            await base.OnConnectedAsync();
        }

        public async Task SendPrivateMessage(Guid receiverId, string message)
        {
            var senderId = GetUserId();
            var msg = await _chatService.CreatePrivateMessageAsync(senderId, receiverId, message);
            await Clients.Group($"user:{senderId}").SendAsync("chat:private", msg);
            await Clients.Group($"user:{receiverId}").SendAsync("chat:private", msg);
        }

        public async Task SendGlobalMessage(string message)
        {
            var senderId = GetUserId();
            var msg = await _chatService.CreateGlobalMessageAsync(senderId, message);
            await Clients.Group("GlobalChat").SendAsync("chat:global", msg);
        }

        private Guid GetUserId()
        {
            if (Context.UserIdentifier == null)
                throw new HubException("Unauthorized");

            return Guid.Parse(Context.UserIdentifier);
        }
    }
}
