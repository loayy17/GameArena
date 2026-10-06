using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/email-verification")]
[EnableRateLimiting("AuthPolicy")]
public class EmailVerificationController(IEmailVerificationService verification, IAuthService auth, IAuthCookieHelper cookies)
    : ControllerBase
{
    [HttpPost("send")]
    public async Task<ActionResult<ApiResponse<object>>> SendAsync(SendOtpRequest request)
    {
        await verification.GenerateAndSendOtpAsync(request.Email, OtpPurpose.EmailVerification);
        return Ok(new ApiResponse<object>());
    }

    [HttpPost("verify")]
    public async Task<ActionResult<ApiResponse<object>>> VerifyAsync(VerifyOtpRequest request)
    {
        await verification.VerifyOtpAsync(request.Email, request.Otp, OtpPurpose.EmailVerification);

        cookies.Issue(Response, await auth.LoginByVerifiedEmailAsync(request.Email));
        return Ok(new ApiResponse<object>());
    }
}
