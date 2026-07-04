using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController(IUserService _userService, ICurrentUserService _currentUser) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return Ok(new ApiResponse<UserResponse> { Data = user });
        }

        [HttpGet("profile")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> Profile()
        {
            var user = await _userService.GetUserByIdAsync(_currentUser.UserId);
            return Ok(new ApiResponse<UserResponse> { Data = user });
        }

        [HttpPost("search")]
        public async Task<ActionResult<ApiResponse<List<UserResponse>>>> GetUsers([FromBody] UserFilterRequest filter)
        {
            var users = await _userService.GetUsersAsync(_currentUser.UserId, filter);
            return Ok(new ApiResponse<List<UserResponse>> { Data = users });
        }
    }
}