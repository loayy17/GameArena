using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FriendController(IFriendService friends, ICurrentUserService currentUser) : ControllerBase
{
    [HttpPost("request/{receiverId}")]
    public async Task<ActionResult<ApiResponse<object>>> SendRequestAsync(Guid receiverId)
    {
        await friends.SendRequestAsync(currentUser.UserId, receiverId);
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("accept/{senderId}")]
    public async Task<ActionResult<ApiResponse<object>>> AcceptRequestAsync(Guid senderId)
    {
        await friends.AcceptRequestAsync(currentUser.UserId, senderId);
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("decline/{senderId}")]
    public async Task<ActionResult<ApiResponse<object>>> DeclineRequestAsync(Guid senderId)
    {
        await friends.DeclineRequestAsync(currentUser.UserId, senderId);
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("cancel-request/{receiverId}")]
    public async Task<ActionResult<ApiResponse<object>>> CancelRequestAsync(Guid receiverId)
    {
        await friends.CancelRequestAsync(currentUser.UserId, receiverId);
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("remove/{friendId}")]
    public async Task<ActionResult<ApiResponse<object>>> RemoveFriendAsync(Guid friendId)
    {
        await friends.RemoveFriendAsync(currentUser.UserId, friendId);
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("block/{blockedId}")]
    public async Task<ActionResult<ApiResponse<object>>> BlockUserAsync(Guid blockedId)
    {
        await friends.BlockUserAsync(currentUser.UserId, blockedId);
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("unblock/{blockedId}")]
    public async Task<ActionResult<ApiResponse<object>>> UnblockUserAsync(Guid blockedId)
    {
        await friends.UnblockUserAsync(currentUser.UserId, blockedId);
        return Ok(new ApiResponse<object>());
    }
}
