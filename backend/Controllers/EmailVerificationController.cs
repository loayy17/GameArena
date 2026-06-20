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
    public class EmailVerificationController : ControllerBase
    {
        private readonly IEmailVerificationService _service;

        public EmailVerificationController(IEmailVerificationService service)
        {
            _service = service;
        }

        // =========================
        // SEND OTP
        // =========================
        [HttpPost("send")]
        public async Task<IActionResult> Send([FromBody] SendOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.ValidationError,
                    Message = "Email is required"
                });
            }

            await _service.GenerateAndSendOtpAsync(
                request.Email,
                OtpPurpose.EmailVerification
            );

            return Ok(new ApiResponse<object>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Message = "OTP sent successfully"
            });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> Verify([FromBody] VerifyOtpRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Otp))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.ValidationError,
                    Message = "Email and OTP are required"
                });
            }

            var result = await _service.VerifyOtpAsync(
                request.Email,
                request.Otp,
                OtpPurpose.EmailVerification
            );

            if (!result)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.OtpInvalid,
                    Message = "Invalid or expired OTP"
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Message = "Email verified successfully"
            });
        }
    }
}