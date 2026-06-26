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
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return Ok(new ApiResponse<UserResponse> { Data = user });
        }

        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            var user = await _userService.GetUserByIdAsync(_currentUser.UserId);
            return Ok(new ApiResponse<UserResponse> { Data = user });
        }

        [HttpGet("search")]
        public async Task<IActionResult> GetUsers([FromQuery] UserFilterRequest filter)
        {
            var users = await _userService.GetUsers(_currentUser.UserId, filter);
            return Ok(new ApiResponse<List<UserResponse>> { Data = users });
        }
    }
}