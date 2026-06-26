using backend.DTOs;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/email-verification")]
    public class EmailVerificationController(IEmailVerificationService _service) : ControllerBase
    {
        [HttpPost("send")]
        public async Task<IActionResult> Send([FromBody] SendOtpRequest request)
        {
            await _service.GenerateAndSendOtpAsync(request.Email, OtpPurpose.EmailVerification);
            return Ok(new ApiResponse<object> { Message = "OTP sent successfully" });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyOtpRequest request)
        {
            await _service.VerifyOtpAsync(request.Email, request.Otp, OtpPurpose.EmailVerification);
            return Ok(new ApiResponse<object> { Message = "Email verified successfully" });
        }
    }
}