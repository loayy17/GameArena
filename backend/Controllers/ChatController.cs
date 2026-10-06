using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController(IChatService chat, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("messages/{friendId}")]
    public async Task<ActionResult<ApiResponse<List<MessageResponse>>>> GetMessagesAsync(Guid friendId)
    {
        var messages = await chat.GetMessagesAsync(currentUser.UserId, friendId);
        return Ok(new ApiResponse<List<MessageResponse>> { Data = messages });
    }

    [HttpGet("unread/per-friend")]
    public async Task<ActionResult<ApiResponse<List<PerFriendUnreadCountResponse>>>> GetUnreadPerFriendAsync()
    {
        var counts = await chat.GetUnreadCountsPerFriendAsync(currentUser.UserId);
        return Ok(new ApiResponse<List<PerFriendUnreadCountResponse>> { Data = counts });
    }
}
