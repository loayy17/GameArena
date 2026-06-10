using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using backend.Data;
using backend.Domain;

namespace backend.Hubs
{
    public interface IChatClient
    {
        string type { get; set; }
        string userId { get; set; }
        string userName { get; set; }
        string message { get; set; }
        DateTime sentAt { get; set; }
    }
    public class ChatHub : Hub
    {
        private readonly AppDbContext _context;

        public ChatHub(AppDbContext context)
        {
            _context = context;
        }
        public override Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != null)
                ConnectionManager.Add(userId, Context.ConnectionId);
            else 
                 throw new Exception("User ID not found in claims. Connection cannot be established.");
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId != null)
                ConnectionManager.Remove(userId, Context.ConnectionId);
            else 
                 throw new Exception("User ID not found in claims. Disconnection cannot be processed properly.");
            return base.OnDisconnectedAsync(exception);
        }
        public async Task SendGlobalMessage(string message)
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if(userId is null) 
                throw new Exception("User ID not found in claims. Cannot send global message.");
            var payload = new
            {
                type = "global",
                userId,

                message,
                sentAt = DateTime.UtcNow
            };
            await Clients.All.SendAsync("ReceiveMessage", payload);
        }

        public async Task SendPrivateMessage(Guid receiverId, string message)
        {
            var senderId = Guid.Parse(Context.User!.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var chat = new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = message,
                SentAt = DateTime.UtcNow
            };

            _context.Messages.Add(chat);
            await _context.SaveChangesAsync();

            var payload = new
            {
                type = "private",
                senderId,
                receiverId,
                message,
                sentAt = chat.SentAt
            };

            foreach (var conn in ConnectionManager.GetConnections(receiverId.ToString()))
            {
                await Clients.Client(conn).SendAsync("ReceiveMessage", payload);
            }

            await Clients.Caller.SendAsync("ReceiveMessage", payload);
        }
    }
}