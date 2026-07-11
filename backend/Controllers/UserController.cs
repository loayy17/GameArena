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
    public class UserController(
        IUserService _userService,
        ICurrentUserService _currentUser) : ControllerBase
    {
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<object>>> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (id == _currentUser.UserId)
                return Ok(new ApiResponse<UserResponse> { Data = user });

            return Ok(new ApiResponse<UserSummaryResponse> { Data = MapperHelper.ToDtoSummary(user) });
        }

        [HttpGet("profile")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> Profile()
        {
            var user = await _userService.GetUserByIdAsync(_currentUser.UserId);
            return Ok(new ApiResponse<UserResponse> { Data = user });
        }

        [HttpPost("search")]
        public async Task<ActionResult<ApiResponse<List<UserSummaryResponse>>>> GetUsers([FromBody] UserFilterRequest filter)
        {
            var users = await _userService.GetUsersAsync(_currentUser.UserId, filter);
            return Ok(new ApiResponse<List<UserSummaryResponse>> { Data = users });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("update")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateUser([FromBody] UserResponse request)
        {
            var updatedUser = await _userService.UpdateUserAsync(request);
            return Ok(new ApiResponse<UserResponse> { Data = updatedUser });
        }

        [HttpPut("update-profile")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateProfile([FromBody] RegisterRequest request)
        {
            var updatedUser = await _userService.UpdateProfileAsync(_currentUser.UserId, request);
            return Ok(new ApiResponse<UserResponse> { Data = updatedUser });
        }

        [HttpPut("change-password")]
        public async Task<ActionResult<ApiResponse<object>>> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            await _userService.ChangePasswordAsync(_currentUser.UserId, request.OldPassword, request.NewPassword);
            return Ok(new ApiResponse<object>());
        }

        [HttpGet("preferences")]
        public async Task<ActionResult<ApiResponse<string?>>> GetPreferences()
        {
            var preferences = await _userService.GetPreferencesAsync(_currentUser.UserId);
            return Ok(new ApiResponse<string?> { Data = preferences });
        }

        [HttpPut("preferences")]
        public async Task<ActionResult<ApiResponse<object>>> UpdatePreferences([FromBody] UserPreferencesRequest request)
        {
            await _userService.UpdatePreferencesAsync(_currentUser.UserId, request.Preferences);
            return Ok(new ApiResponse<object>());
        }
    }
}
