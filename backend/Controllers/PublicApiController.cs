using backend.DTOs.Requests;
using backend.DTOs.Responses;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace backend.Controllers;

[ApiController]
[Route("api/public")]
[EnableRateLimiting("PublicApi")]
public class PublicApiController(IFeedbackService feedback) : ControllerBase
{
    [HttpGet("feedback")]
    public async Task<ActionResult<ApiResponse<List<FeedbackResponse>>>> ListFeedbackAsync(
        [FromQuery] int limit = Constants.DefaultLimit,
        [FromQuery] int offset = 0)
    {
        var items = await feedback.GetAllAsync(Math.Clamp(limit, 1, Constants.MaxLimit), Math.Max(0, offset));
        return Ok(new ApiResponse<List<FeedbackResponse>> { Data = items });
    }

    [HttpGet("feedback/{id}")]
    public async Task<ActionResult<ApiResponse<FeedbackResponse>>> GetFeedbackAsync(Guid id)
    {
        var item = await feedback.GetByIdAsync(id);
        return Ok(new ApiResponse<FeedbackResponse> { Data = item });
    }

    [HttpPost("feedback")]
    public async Task<ActionResult<ApiResponse<FeedbackResponse>>> CreateFeedbackAsync([FromBody] FeedbackRequest request)
    {
        var created = await feedback.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetFeedbackAsync),
            new { id = created.Id },
            new ApiResponse<FeedbackResponse> { Data = created });
    }

    [HttpPut("feedback/{id}")]
    public async Task<ActionResult<ApiResponse<FeedbackResponse>>> UpdateFeedbackAsync(Guid id, [FromBody] FeedbackRequest request)
    {
        var updated = await feedback.UpdateAsync(id, request);
        return Ok(new ApiResponse<FeedbackResponse> { Data = updated });
    }

    [HttpDelete("feedback/{id}")]
    public async Task<ActionResult<ApiResponse<object>>> DeleteFeedbackAsync(Guid id)
    {
        await feedback.DeleteAsync(id);
        return Ok(new ApiResponse<object>());
    }
}
