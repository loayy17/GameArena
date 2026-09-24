using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Middleware;
using backend.Services.Interface;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/public")]
    [EnableRateLimiting("PublicApi")]
    public class PublicApiController(IFeedbackService _feedbackService) : ControllerBase
    {

        [HttpGet("feedback")]
        [ProducesResponseType(typeof(ApiResponse<List<FeedbackResponse>>), StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<List<FeedbackResponse>>>> GetFeedback(
            [FromQuery] int limit = 10,
            [FromQuery] int offset = 0)
        {
            limit = Math.Clamp(limit, 1, 100);
            offset = Math.Max(0, offset);
            var items = await _feedbackService.GetAllAsync(limit, offset);
            return Ok(new ApiResponse<List<FeedbackResponse>> { Data = items });
        }

        [HttpGet("feedback/{id}")]
        public async Task<ActionResult<ApiResponse<FeedbackResponse>>> GetFeedbackById(Guid id)
        {
            var feedback = await _feedbackService.GetByIdAsync(id);
            return Ok(new ApiResponse<FeedbackResponse> { Data = feedback });
        }

        [HttpPost("feedback")]
        public async Task<ActionResult<ApiResponse<FeedbackResponse>>> CreateFeedback(
            [FromBody] FeedbackRequest request)
        {
            var created = await _feedbackService.CreateAsync(request);
            return CreatedAtAction(nameof(GetFeedbackById), new { id = created.Id },
                new ApiResponse<FeedbackResponse> { Data = created });
        }

        [HttpPut("feedback/{id}")]
        public async Task<ActionResult<ApiResponse<FeedbackResponse>>> UpdateFeedback(Guid id, [FromBody] FeedbackRequest request)
        {
            var updated = await _feedbackService.UpdateAsync(id, request);
            return Ok(new ApiResponse<FeedbackResponse> { Data = updated });
        }

        [HttpDelete("feedback/{id}")]
        public async Task<ActionResult<ApiResponse<object>>> DeleteFeedback(Guid id)
        {
            await _feedbackService.DeleteAsync(id);
            return Ok(new ApiResponse<object>());
        }
    }
}