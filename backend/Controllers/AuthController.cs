using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[EnableRateLimiting("SessionPolicy")]
public class AuthController(IAuthService auth, IAuthCookieHelper cookies) : ControllerBase
{
    [EnableRateLimiting("AuthPolicy")]
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<object>>> RegisterAsync(RegisterRequest request)
    {
        await auth.RegisterAsync(request);
        return Ok(new ApiResponse<object>());
    }

    [EnableRateLimiting("AuthPolicy")]
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<object>>> LoginAsync(LoginRequest request)
    {
        cookies.Issue(Response, await auth.LoginAsync(request));
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<object>>> LogoutAsync()
    {
        var refreshToken = Request.Cookies[Constants.Refresh]
            ?? throw new AppException(ErrorCode.Unauthorized);

        await auth.RevokeRefreshTokenAsync(refreshToken);
        cookies.Clear(Response);

        return Ok(new ApiResponse<object>());
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<object>>> RefreshAsync()
    {
        var refreshToken = Request.Cookies[Constants.Refresh]
            ?? throw new AppException(ErrorCode.RefreshTokenInvalid);

        cookies.Issue(Response, await auth.RefreshAccessTokenAsync(refreshToken));
        return Ok(new ApiResponse<object>());
    }

    [EnableRateLimiting("AuthPolicy")]
    [HttpPost("forgot-password")]
    public async Task<ActionResult<ApiResponse<object>>> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        await auth.ForgotPasswordAsync(request.Email);
        return Ok(new ApiResponse<object>());
    }

    [EnableRateLimiting("AuthPolicy")]
    [HttpPost("reset-password")]
    public async Task<ActionResult<ApiResponse<object>>> ResetPasswordAsync(ResetPasswordRequest request)
    {
        await auth.ResetPasswordAsync(request.Email, request.Otp, request.NewPassword);
        return Ok(new ApiResponse<object>());
    }
}
