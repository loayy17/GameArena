using backend.Services.Interface;
using backend.DTOs;
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
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            var user = await _authService.RegisterAsync(request);

            if (user is null)
                return BadRequest(new { message = "User with this email already exists" });

            return Ok(new { message = "User registered successfully", userId = user.Id });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _authService.LoginAsync(request);

            if (response is null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(response);
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
        {
            var response = await _authService.RefreshAccessTokenAsync(request.RefreshToken);

            if (response is null)
                return Unauthorized(new { message = "Invalid or expired refresh token" });

            return Ok(response);
        }
    }
}

