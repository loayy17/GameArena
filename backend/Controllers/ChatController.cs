using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController(
        IChatService _chatService,
        ICurrentUserService _currentUser,
        IServiceScopeFactory _scopeFactory) : ControllerBase
    {
        [HttpGet("messages/{friendId}")]
        public async Task<ActionResult<ApiResponse<List<MessageResponse>>>> GetMessages(Guid friendId)
        {
            var userId = _currentUser.UserId;
            var messages = await _chatService.GetMessagesAsync(userId, friendId);
            _ = SendCountersAsyncSafe(userId);

            return Ok(new ApiResponse<List<MessageResponse>> { Data = messages });
        }

        private async Task SendCountersAsyncSafe(Guid userId)
        {
            try
            {
                await using var scope = _scopeFactory.CreateAsyncScope();
                var notificationService = scope.ServiceProvider
                    .GetRequiredService<INotificationService>();
                await notificationService.SendCountersAsync(userId);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to push counters for {userId} after reading messages.");
                Console.WriteLine(ex);
            }
        }

        [HttpGet("unreadMessages/count")]
        public async Task<ActionResult<ApiResponse<int>>> GetUnreadMessagesCount()
        {
            var userId = _currentUser.UserId;
            var count = await _chatService.GetUnreadMessagesCountAsync(userId);
            return Ok(new ApiResponse<int> { Data = count });
        }

        [HttpGet("unread/per-friend")]
        public async Task<ActionResult<ApiResponse<List<PerFriendUnreadCountResponse>>>> GetUnreadPerFriend()
        {
            var userId = _currentUser.UserId;
            var counts = await _chatService.GetUnreadCountsPerFriendAsync(userId);
            return Ok(new ApiResponse<List<PerFriendUnreadCountResponse>> { Data = counts });
        }
    }
}