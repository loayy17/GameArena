using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class HealthController(IHealthService _healthService) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<HealthResponse>>> GetHealth()
        {
            var health = await _healthService.GetHealthAsync();
            return Ok(new ApiResponse<HealthResponse> { Data = health });
        }
    }
}
