using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendController(
        IFriendService _friendService,
        ICurrentUserService _currentUser) : ControllerBase
    {
        [HttpPost("request/{receiverId}")]
        public async Task<ActionResult<ApiResponse<object>>> SendRequest(Guid receiverId)
        {
            await _friendService.SendRequestAsync(_currentUser.UserId, receiverId);
            return Ok(new ApiResponse<object> { Message = "Friend request sent" });
        }

        [HttpPost("accept/{senderId}")]
        public async Task<ActionResult<ApiResponse<object>>> AcceptRequest(Guid senderId)
        {
            await _friendService.AcceptRequestAsync(_currentUser.UserId, senderId);
            return Ok(new ApiResponse<object> { Message = "Friend request accepted" });
        }

        [HttpPost("decline/{senderId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeclineRequest(Guid senderId)
        {
            await _friendService.DeclineRequestAsync(_currentUser.UserId, senderId);
            return Ok(new ApiResponse<object> { Message = "Friend request declined" });
        }

        [HttpPost("remove/{friendId}")]
        public async Task<ActionResult<ApiResponse<object>>> RemoveFriend(Guid friendId)
        {
            await _friendService.RemoveFriendAsync(_currentUser.UserId, friendId);
            return Ok(new ApiResponse<object> { Message = "Friend removed" });
        }

        [HttpPost("block/{blockedId}")]
        public async Task<ActionResult<ApiResponse<object>>> BlockUser(Guid blockedId)
        {
            await _friendService.BlockUserAsync(_currentUser.UserId, blockedId);
            return Ok(new ApiResponse<object> { Message = "User blocked" });
        }

        [HttpPost("unblock/{blockedId}")]
        public async Task<ActionResult<ApiResponse<object>>> UnblockUser(Guid blockedId)
        {
            await _friendService.UnblockUserAsync(_currentUser.UserId, blockedId);
            return Ok(new ApiResponse<object> { Message = "User unblocked" });
        }

        [HttpPost("friends")]
        public async Task<ActionResult<ApiResponse<List<UserSummaryResponse>>>> GetFriends([FromBody] UserFilterRequest filter)
        {
            var friends = await _friendService.GetFriendsAsync(_currentUser.UserId, filter);
            return Ok(new ApiResponse<List<UserSummaryResponse>> { Data = friends });
        }

        [HttpGet("requests")]
        public async Task<ActionResult<ApiResponse<List<FriendRequestReceivedResponse>>>> GetReceivedRequests()
        {
            var requests = await _friendService.GetReceivedRequestsAsync(_currentUser.UserId);
            return Ok(new ApiResponse<List<FriendRequestReceivedResponse>> { Data = requests });
        }

        [HttpGet("sent")]
        public async Task<ActionResult<ApiResponse<List<FriendRequestSentResponse>>>> GetSentRequests()
        {
            var requests = await _friendService.GetSentRequestsAsync(_currentUser.UserId);
            return Ok(new ApiResponse<List<FriendRequestSentResponse>> { Data = requests });
        }

        [HttpGet("blocked")]
        public async Task<ActionResult<ApiResponse<List<UserSummaryResponse>>>> GetBlockedUsers()
        {
            var blocked = await _friendService.GetBlockedUsersAsync(_currentUser.UserId);
            return Ok(new ApiResponse<List<UserSummaryResponse>> { Data = blocked });
        }
    }
}
