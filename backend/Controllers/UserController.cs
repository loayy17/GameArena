using backend.Domain;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController(IUserService users, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserPublicProfileResponse>>> GetUserAsync(Guid id)
    {
        var profile = await users.GetUserProfileAsync(id, currentUser.UserId);
        return Ok(new ApiResponse<UserPublicProfileResponse> { Data = profile });
    }

    [HttpGet("profile")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> ProfileAsync()
    {
        var user = await users.GetUserByIdAsync(currentUser.UserId);
        return Ok(new ApiResponse<UserResponse> { Data = user });
    }

    [HttpPost("search")]
    public async Task<ActionResult<ApiResponse<List<UserSummaryResponse>>>> SearchAsync([FromBody] UserFilterRequest filter)
    {
        var found = await users.GetUsersAsync(currentUser.UserId, filter);
        return Ok(new ApiResponse<List<UserSummaryResponse>> { Data = found });
    }

    [HttpGet("leaderboard")]
    public async Task<ActionResult<ApiResponse<List<UserSummaryResponse>>>> GetLeaderboardAsync([FromQuery] int limit = 10)
    {
        var top = await users.GetLeaderboardAsync(limit);
        return Ok(new ApiResponse<List<UserSummaryResponse>> { Data = top });
    }

    [HttpPut("update-profile")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> UpdateProfileAsync([FromBody] UpdateProfileRequest request)
    {
        var updated = await users.UpdateProfileAsync(currentUser.UserId, request);
        return Ok(new ApiResponse<UserResponse> { Data = updated });
    }

    [HttpPut("change-password")]
    public async Task<ActionResult<ApiResponse<object>>> ChangePasswordAsync([FromBody] ChangePasswordRequest request)
    {
        await users.ChangePasswordAsync(currentUser.UserId, request.OldPassword, request.NewPassword);
        return Ok(new ApiResponse<object>());
    }

    [HttpGet("preferences")]
    public async Task<ActionResult<ApiResponse<string?>>> GetPreferencesAsync()
    {
        var preferences = await users.GetPreferencesAsync(currentUser.UserId);
        return Ok(new ApiResponse<string?> { Data = preferences });
    }

    [HttpPut("preferences")]
    public async Task<ActionResult<ApiResponse<object>>> UpdatePreferencesAsync([FromBody] UserPreferencesRequest request)
    {
        await users.UpdatePreferencesAsync(currentUser.UserId, request.Preferences);
        return Ok(new ApiResponse<object>());
    }

    [HttpGet("{id}/avatar")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvatarAsync(Guid id)
    {
        var avatar = await users.GetAvatarAsync(id);

        return avatar is null ? NotFound() : File(avatar.Value.Bytes, avatar.Value.ContentType);
    }

    [HttpPost("avatar")]
    [RequestSizeLimit(Constants.AvatarMaxBytes)]
    public async Task<ActionResult<ApiResponse<UserResponse>>> UploadAvatarAsync(IFormFile file)
    {
        var user = await users.UpdateAvatarAsync(currentUser.UserId, file);
        return Ok(new ApiResponse<UserResponse> { Data = user });
    }

    [HttpDelete("avatar")]
    public async Task<ActionResult<ApiResponse<UserResponse>>> RemoveAvatarAsync()
    {
        var user = await users.RemoveAvatarAsync(currentUser.UserId);
        return Ok(new ApiResponse<UserResponse> { Data = user });
    }

    [HttpDelete("delete-account")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteAccountAsync()
    {
        await users.DeleteAccountAsync(currentUser.UserId, currentUser.UserId);
        return Ok(new ApiResponse<object>());
    }

    [Authorize(Roles = Constants.StaffRoles)]
    [HttpGet("admin/stats")]
    public async Task<ActionResult<ApiResponse<AdminStatsResponse>>> GetStatsAsync()
    {
        var stats = await users.GetStatsAsync();
        return Ok(new ApiResponse<AdminStatsResponse> { Data = stats });
    }

    [Authorize(Roles = Constants.StaffRoles)]
    [HttpGet("admin/users")]
    public async Task<ActionResult<ApiResponse<List<AdminUserResponse>>>> SearchAsAdminAsync([FromQuery] UserFilterRequest? filter)
    {
        var found = await users.GetUsersByAdminAsync(filter);
        return Ok(new ApiResponse<List<AdminUserResponse>> { Data = found });
    }

    [Authorize(Roles = Constants.StaffRoles)]
    [HttpPost("admin/users/{id}/ban")]
    public async Task<ActionResult<ApiResponse<object>>> BanUserAsync(Guid id)
    {
        await users.BanUserAsync(currentUser.UserId, id);
        return Ok(new ApiResponse<object>());
    }

    [Authorize(Roles = Constants.StaffRoles)]
    [HttpPost("admin/users/{id}/unban")]
    public async Task<ActionResult<ApiResponse<object>>> UnbanUserAsync(Guid id)
    {
        await users.UnbanUserAsync(currentUser.UserId, id);
        return Ok(new ApiResponse<object>());
    }

    [Authorize(Roles = Constants.RoleAdmins)]
    [HttpPut("admin/users/role")]
    public async Task<ActionResult<ApiResponse<object>>> SetRoleAsync([FromBody] SetRoleRequest request)
    {
        await users.SetRoleAsync(currentUser.UserId, request.Id, request.Role);
        return Ok(new ApiResponse<object>());
    }

    [Authorize(Roles = Constants.RoleAdmins)]
    [HttpDelete("admin/users/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteUserAsync(Guid id)
    {
        await users.DeleteAccountAsync(currentUser.UserId, id);
        return Ok(new ApiResponse<object>());
    }
}

