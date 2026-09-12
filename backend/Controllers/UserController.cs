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
    public class UserController(
        IUserService _userService,
        ICurrentUserService _currentUser) : ControllerBase
    {
        // User endpoints
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<UserPublicProfileResponse>>> GetUser(Guid id)
        {
            var profile = await _userService.GetUserProfileAsync(id, _currentUser.UserId);
            return Ok(new ApiResponse<UserPublicProfileResponse> { Data = profile });
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

        [HttpPut("update-profile")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateProfile([FromBody] UpdateProfileRequest request)
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

        [HttpGet("{id}/avatar")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAvatar(Guid id)
        {
            var avatar = await _userService.GetAvatarAsync(id);
            if (avatar is null) return NotFound();
            return File(avatar.Value.Bytes, avatar.Value.ContentType);
        }

        [HttpPost("avatar")]
        [RequestSizeLimit(2 * 1024 * 1024)]
        public async Task<ActionResult<ApiResponse<UserResponse>>> UploadAvatar(IFormFile file)
        {
            var user = await _userService.UpdateAvatarAsync(_currentUser.UserId, file);
            return Ok(new ApiResponse<UserResponse> { Data = user });
        }

        [HttpDelete("avatar")]
        public async Task<ActionResult<ApiResponse<UserResponse>>> RemoveAvatar()
        {
            var user = await _userService.RemoveAvatarAsync(_currentUser.UserId);
            return Ok(new ApiResponse<UserResponse> { Data = user });
        }

        [HttpDelete("delete-account")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteAccount()
        {
            await _userService.DeleteAccountAsync(_currentUser.UserId, _currentUser.UserId);
            return Ok(new ApiResponse<object>());
        }

        // Admin and Moderator roles)
        [Authorize(Roles = "Admin,Moderator,SuperAdmin")]
        [HttpGet("admin/stats")]
        public async Task<ActionResult<ApiResponse<AdminStatsResponse>>> GetStats()
        {
            var stats = await _userService.GetStatsAsync();
            return Ok(new ApiResponse<AdminStatsResponse> { Data = stats });
        }

        [Authorize(Roles = "Admin,Moderator,SuperAdmin")]
        [HttpGet("admin/users")]
        public async Task<ActionResult<ApiResponse<List<AdminUserResponse>>>> GetUsersByAdmin([FromQuery] UserFilterRequest? filter)
        {
            var users = await _userService.GetUsersByAdminAsync(filter);
            return Ok(new ApiResponse<List<AdminUserResponse>> { Data = users });
        }

        [Authorize(Roles = "Admin,Moderator,SuperAdmin")]
        [HttpPost("admin/users/{id}/ban")]
        public async Task<ActionResult<ApiResponse<object>>> BanUser(Guid id)
        {
            await _userService.BanUserAsync(_currentUser.UserId, id);
            return Ok(new ApiResponse<object>());
        }

        [Authorize(Roles = "Admin,Moderator,SuperAdmin")]
        [HttpPost("admin/users/{id}/unban")]
        public async Task<ActionResult<ApiResponse<object>>> UnbanUser(Guid id)
        {
            await _userService.UnbanUserAsync(_currentUser.UserId, id);
            return Ok(new ApiResponse<object>());
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpPut("admin/users/role")]
        public async Task<ActionResult<ApiResponse<object>>> SetRole([FromBody] SetRoleRequest request)
        {
            await _userService.SetRoleAsync(_currentUser.UserId, request.Id, request.Role);
            return Ok(new ApiResponse<object>());
        }

        [Authorize(Roles = "Admin,SuperAdmin")]
        [HttpDelete("admin/users/{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteAccountByAdmin(Guid id)
        {
            await _userService.DeleteAccountAsync(_currentUser.UserId, id);
            return Ok(new ApiResponse<object>());
        }
    }
}
