using backend.DTOs.Responses;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MatchHistoryController(IMatchHistoryService matchHistory, ICurrentUserService currentUser) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<MatchHistoryResponse>>>> GetMatchHistoryAsync()
    {
        var history = await matchHistory.GetMatchHistoryByUserIdAsync(currentUser.UserId);
        return Ok(new ApiResponse<List<MatchHistoryResponse>> { Data = history });
    }
}
