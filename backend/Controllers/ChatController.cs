using backend.DTOs.Responses;
using backend.Services;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/chat")]
    [Authorize]
    public class ChatController(IChatService chatService, ICurrentUserService _currentUser) : ControllerBase
    {
        [HttpGet("messages/{friendId}")]
        public async Task<IActionResult> GetMessages(Guid friendId)
        {
            var userId = _currentUser.UserId;
            var messages = await chatService.GetMessagesAsync(userId, friendId);
            return Ok(new ApiResponse<List<MessageResponse>> { Data = messages });
        }
        // this is api to show the mesages page as 
        // loay hindi
            // message
        // omar
           // hello

        //[HttpGet("LastMessages")]
        //public async Task<IActionResult> GetLastMessagesFriends()
        //{
        //    var userId = _currentUser.UserId;
        //    var 
        //}
    }
}