using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService _authService, IAuthCookieService _authCookiesService) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<object>>> Register(RegisterRequest request)
        {
            await _authService.RegisterAsync(request);

            return Ok(new ApiResponse<object> { Message = "User registered. Check email for OTP." });
        }

        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<object>>> Login(LoginRequest request)
        {
            var response = await _authService.LoginAsync(request) ?? throw new AppException(ErrorCode.InvalidCredentials);

            _authCookiesService.SetAuthCookies(Response, response);

            return Ok(new ApiResponse<object> { Message = "Login successful" });
        }

        [HttpPost("logout")]
        public async Task<ActionResult<ApiResponse<object>>> Logout()
        {
            var refreshToken = Request.Cookies["refresh_token"] ?? throw new AppException(ErrorCode.Unauthorized);
            await _authService.RevokeRefreshTokenAsync(refreshToken);
            _authCookiesService.ClearAuthCookies(Response);
            return Ok(new ApiResponse<object> { Message = "Logged out" });
        }

        [HttpPost("refresh")]
        public async Task<ActionResult<ApiResponse<object>>> Refresh()
        {
            var refreshToken = Request.Cookies["refresh_token"]
                ?? throw new AppException(ErrorCode.RefreshTokenInvalid);

            var response = await _authService.RefreshAccessTokenAsync(refreshToken);
            _authCookiesService.SetAuthCookies(Response, response);

            return Ok(new ApiResponse<object> { Message = "Token refreshed" });
        }

        [HttpPost("forgot-password")]
        public async Task<ActionResult<ApiResponse<object>>> ForgotPassword(ForgotPasswordRequest request)
        {
            await _authService.ForgotPassword(request.Email);
            return Ok(new ApiResponse<object> { Message = "If the email exists, OTP has been sent" });
        }

        [HttpPost("reset-password")]
        public async Task<ActionResult<ApiResponse<object>>> ResetPassword(ResetPasswordRequest request)
        {
            await _authService.ResetPasswordAsync(request.Email, request.Otp, request.NewPassword);

            return Ok(new ApiResponse<object> { Message = "Password reset successful" });
        }
    }
}