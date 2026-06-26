using backend.Auth;
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
    public class FriendController(IFriendService _friendService, ICurrentUserService _currentUser) : ControllerBase
    {

        [HttpPost("request/{receiverId}")]
        public async Task<IActionResult> SendRequest(Guid receiverId)
        {
            var senderId = _currentUser.UserId;
            await _friendService.SendFriendRequestAsync(senderId, receiverId);
            return Ok(new ApiResponse<object> { Message = "Friend request sent" });
        }

        [HttpGet("requests")]
        public async Task<IActionResult> GetRequests()
        {
            var senderId = _currentUser.UserId;
            var requests = await _friendService.GetFriendRequestsAsync(senderId);
            return Ok(new ApiResponse<List<FriendResponse>> { Data = requests });
        }


        [HttpGet("sent")]
        public async Task<IActionResult> GetSentRequests()
        {
            var senderId = _currentUser.UserId;
            var requests = await _friendService.GetSentRequestsAsync(senderId);
            return Ok(new ApiResponse<List<SentResponse>> { Data = requests });

        }

        [HttpGet("friends")]
        public async Task<IActionResult> GetFriends([FromBody] FriendFilterRequest filter)
        {
            var senderId = _currentUser.UserId;
            var friends = await _friendService.GetFriendsAsync(senderId, filter);
            return Ok(new ApiResponse<List<UserResponse>> { Data = friends });
        }

        [HttpPost("accept/{senderId}")]
        public async Task<IActionResult> AcceptRequest(Guid senderId)
        {
            var userId = _currentUser.UserId;
            await _friendService.AcceptFriendRequestAsync(userId, senderId);
            return Ok(new ApiResponse<object> { });

        }

        [HttpPost("decline/{senderId}")]
        public async Task<IActionResult> DeclineRequest(Guid senderId)
        {
            var userId = _currentUser.UserId;
            await _friendService.DeclineFriendRequestAsync(userId, senderId);
            return Ok(new ApiResponse<object> { });
        }
    }
}