using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChatController(IChatService _chatService, ICurrentUserService _currentUser) : ControllerBase
    {
        [HttpGet("messages/{friendId}")]
        public async Task<ActionResult<ApiResponse<List<MessageResponse>>>> GetMessages(Guid friendId)
        {
            var userId = _currentUser.UserId;
            var messages = await _chatService.GetMessagesAsync(userId, friendId);
            return Ok(new ApiResponse<List<MessageResponse>> { Data = messages });
        }

        [HttpGet("unreadMessages/count")]
        public async Task<ActionResult<ApiResponse<int>>> GetUnreadMessagesCount()
        {
            var userId = _currentUser.UserId;
            var count = await _chatService.GetUnreadMessagesCountAsync(userId);
            return Ok(new ApiResponse<int> { Data = count });
        }
    }
}
