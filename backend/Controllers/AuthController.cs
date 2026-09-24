using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [EnableRateLimiting("AuthPolicy")]
    public class AuthController(IAuthService _authService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<object>>> Register(RegisterRequest request)
        {
            await _authService.RegisterAsync(request);

            return Ok(new ApiResponse<object>());
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<object>>> Login(LoginRequest request)
        {
            var response = await _authService.LoginAsync(request) ?? throw new AppException(ErrorCode.InvalidCredentials);

            AuthCookieHelper.SetAuthCookies(Response, response);

            return Ok(new ApiResponse<object>());
        }

        [HttpPost("logout")]
        public async Task<ActionResult<ApiResponse<object>>> Logout()
        {
            var refreshToken = Request.Cookies["refresh_token"] ?? throw new AppException(ErrorCode.Unauthorized);
            await _authService.RevokeRefreshTokenAsync(refreshToken);
            AuthCookieHelper.ClearAuthCookies(Response);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<ApiResponse<object>>> Refresh()
        {
            var refreshToken = Request.Cookies["refresh_token"]
                ?? throw new AppException(ErrorCode.RefreshTokenInvalid);

            var response = await _authService.RefreshAccessTokenAsync(refreshToken);
            AuthCookieHelper.SetAuthCookies(Response, response);

            return Ok(new ApiResponse<object>());
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<object>>> ForgotPassword(ForgotPasswordRequest request)
        {
            await _authService.ForgotPasswordAsync(request.Email);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<object>>> ResetPassword(ResetPasswordRequest request)
        {
            await _authService.ResetPasswordAsync(request.Email, request.Otp, request.NewPassword);

            return Ok(new ApiResponse<object>());
        }
    }
}
