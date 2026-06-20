using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Mappers;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [Authorize]
        [HttpGet("user/{id}")]
        public async Task<IActionResult> GetUserById(Guid id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.UserNotFound,
                    Message = "User not found"
                });
            }

            return Ok(new ApiResponse<UserResponse>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Data = UserMapper.ToDto(user)
            });
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsersAsync()
        {
            var users = await _userService.GetAllUsersAsync();

            if (users == null || !users.Any())
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.NoUsersFound,
                    Message = "No users found"
                });
            }

            return Ok(new ApiResponse<List<UserResponse>>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Data = users.Select(UserMapper.ToDto).ToList()
            });
        }

        [Authorize]
        [HttpGet("getFriend/{id}")]
        public async Task<IActionResult> GetUserFriends(Guid id)
        {
            var friends = await _userService.GetUserFriends(id);

            if (friends == null || !friends.Any())
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.NoFriendsFound,
                    Message = "No friends found"
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Data = friends
            });
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            var userIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.Unauthorized,
                    Message = "Unauthorized"
                });
            }

            var user =
                await _userService.GetUserByIdAsync(
                    Guid.Parse(userIdClaim.Value));

            if (user == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.UserNotFound,
                    Message = "User not found"
                });
            }

            return Ok(new ApiResponse<UserResponse>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Data = UserMapper.ToDto(user)
            });
        }
    }
}