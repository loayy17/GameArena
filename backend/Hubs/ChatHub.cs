using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ChatHub(IChatService chatService) : Hub
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
            var msg = await chatService.CreatePrivateMessageAsync(senderId, receiverId, message);
            var payload = new { senderId, receiverId, message = msg.Content, sentAt = msg.SentAt };
            var group = ChatHelper.GetPrivateGroup(senderId, receiverId);
            await Clients.Group(group).SendAsync("chat:private", payload);
            await Clients.Group($"user:{receiverId}").SendAsync("chat:notification", payload);
        }

        public async Task SendGlobalMessage(string message)
        {
            var senderId = GetUserId();
            var msg = await chatService.CreateGlobalMessageAsync(senderId, message);
            var payload = new { senderId, message = msg.Content, sentAt = msg.SentAt };
            await Clients.Group("GlobalChat").SendAsync("chat:global", payload);
        }

        private Guid GetUserId()
        {
            if (Context.UserIdentifier == null)
                throw new HubException("Unauthorized");

            return Guid.Parse(Context.UserIdentifier);
        }
    }
}