using backend.DTOs;
using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Services.Interface;
//using Microsoft.AspNetCore.Identity.Data;

//using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            try
            {
                await _authService.RegisterAsync(request);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    ErrorCode = ErrorCode.None,
                    Message = "User registered. Check email for OTP."
                });
            }
            catch (Exception ex) when (ex.Message == "EMAIL_ALREADY_EXISTS")
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.EmailAlreadyExists,
                    Message = "Email already exists"
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                SetAuthCookies(response!);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    ErrorCode = ErrorCode.None,
                    Message = "OK"
                });
            }
            catch (Exception ex)
            {
                return ex.Message switch
                {
                    "EMAIL_NOT_VERIFIED" => Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.EmailNotVerified,
                        Message = "Email not verified"
                    }),

                    "INVALID_CREDENTIALS" => Unauthorized(new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.InvalidCredentials,
                        Message = "Invalid credentials"
                    }),

                    _ => StatusCode(500, new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.ServerError,
                        Message = "Server error"
                    })
                };
            }
        }
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var refreshToken = Request.Cookies["refresh_token"];

            if (!string.IsNullOrEmpty(refreshToken))
            {
                await _authService.RevokeRefreshTokenAsync(refreshToken);
            }

            Response.Cookies.Delete("access_token");
            Response.Cookies.Delete("refresh_token");

            return Ok(new ApiResponse<object>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Message = "Logged out"
            });
        }
        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh()
        {
            var refreshToken = Request.Cookies["refresh_token"];

            if (string.IsNullOrEmpty(refreshToken))
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.RefreshTokenInvalid,
                    Message = "Missing refresh token"
                });

            var response = await _authService.RefreshAccessTokenAsync(refreshToken);

            if (response is null)
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.RefreshTokenInvalid,
                    Message = "Invalid refresh token"
                });

            SetAuthCookies(response);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                ErrorCode = ErrorCode.None,
                Message = "OK"
            });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
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

            try
            {
                await _authService.ForgotPassword(request.Email);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    ErrorCode = ErrorCode.None,
                    Message = "If the email exists, OTP has been sent"
                });
            }
            catch(Exception err)
            {
                Console.WriteLine("err", err);
                return BadRequest();
                //return Ok(new ApiResponse<object>
                //{
                //    Success = true,
                //    ErrorCode = ErrorCode.None,
                //    Message = "If the email exists, OTP has been sent"
                //});
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Otp) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = ErrorCode.ValidationError,
                    Message = "Invalid input"
                });
            }

            try
            {
                await _authService.ResetPasswordAsync(
                    request.Email,
                    request.Otp,
                    request.NewPassword
                );

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    ErrorCode = ErrorCode.None,
                    Message = "Password reset successful"
                });
            }
            catch (Exception ex)
            {
                return ex.Message switch
                {
                    "EMAIL_NOT_FOUND" => NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.EmailNotFound,
                        Message = "Email not found"
                    }),

                    "INVALID_OTP" => BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.OtpInvalid,
                        Message = "Invalid OTP"
                    }),

                    "OTP_EXPIRED" => BadRequest(new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.OtpExpired,
                        Message = "OTP expired"
                    }),

                    _ => StatusCode(500, new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.ServerError,
                        Message = "Server error"
                    })
                };
            }
        }
        private void SetAuthCookies(AuthResponse response)
        {
            var accessOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddMinutes(15)
            };

            var refreshOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("access_token", response.AccessToken, accessOptions);
            Response.Cookies.Append("refresh_token", response.RefreshToken, refreshOptions);
        }
    }
}

