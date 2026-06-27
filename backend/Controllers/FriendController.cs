using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Hubs;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FriendController(
        IFriendService _friendService,
        ICurrentUserService _currentUser,
        IHubContext<ChatHub> _chatHubContext) : ControllerBase
    {
        [HttpPost("request/{receiverId}")]
        public async Task<ActionResult<ApiResponse<object>>> SendRequest(Guid receiverId)
        {
            var senderId = _currentUser.UserId;
            await _friendService.SendFriendRequestAsync(senderId, receiverId);
            await _chatHubContext.Clients.User(receiverId.ToString()).SendAsync("friend:request", new {senderId,receiverId});
            return Ok(new ApiResponse<object> { Message = "Friend request sent" });
        }

        [HttpGet("requests")]
        public async Task<ActionResult<ApiResponse<FriendRequestReceivedResponse>>> GetRequests()
        {
            var senderId = _currentUser.UserId;
            var requests = await _friendService.GetFriendRequestsAsync(senderId);
            return Ok(new ApiResponse<List<FriendRequestReceivedResponse>> { Data = requests });
        }

        [HttpGet("sent")]
        public async Task<ActionResult<ApiResponse<FriendRequestSentResponse>>> GetSentRequests()
        {
            var senderId = _currentUser.UserId;
            var requests = await _friendService.GetSentRequestsAsync(senderId);
            return Ok(new ApiResponse<List<FriendRequestSentResponse>> { Data = requests });
        }

        [HttpPost("friends")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> GetFriends([FromBody] UserFilterRequest filter)
        {
            var senderId = _currentUser.UserId;
            var friends = await _friendService.GetFriendsAsync(senderId, filter);
            return Ok(new ApiResponse<List<UserResponse>> { Data = friends });
        }

        [HttpPost("accept/{senderId}")]
        public async Task<ActionResult<ApiResponse<object>>> AcceptRequest(Guid senderId)
        {
            var userId = _currentUser.UserId;
            await _friendService.AcceptFriendRequestAsync(userId, senderId);
            return Ok(new ApiResponse<object> { Message = "Accept" });
        }

        [HttpPost("decline/{senderId}")]
        public async Task<ActionResult<ApiResponse<object>>> DeclineRequest(Guid senderId)
        {
            var userId = _currentUser.UserId;
            await _friendService.DeclineFriendRequestAsync(userId, senderId);
            return Ok(new ApiResponse<object> { Message = "Declined Friend" });
        }
    }
}