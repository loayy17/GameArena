using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/email-verification")]
    public class EmailVerificationController(IEmailVerificationService _service, IAuthService _authService) : ControllerBase
    {
        [HttpPost("send")]
        public async Task<ActionResult<ApiResponse<object>>> Send([FromBody] SendOtpRequest request)
        {
            await _service.GenerateAndSendOtpAsync(request.Email, OtpPurpose.EmailVerification);
            return Ok(new ApiResponse<object>());
        }

        [HttpPost("verify")]
        public async Task<ActionResult<ApiResponse<object>>> Verify([FromBody] VerifyOtpRequest request)
        {
            await _service.VerifyOtpAsync(request.Email, request.Otp, OtpPurpose.EmailVerification);

            var auth = await _authService.LoginByVerifiedEmailAsync(request.Email);
            AuthCookieHelper.SetAuthCookies(Response, auth);

            return Ok(new ApiResponse<object>());
        }
    }
}
