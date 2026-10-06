using backend.DTOs.Responses;
using backend.Enums;
using backend.Utils;
using Microsoft.AspNetCore.Diagnostics;

namespace backend.Middleware;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        var app = exception as AppException;
        if (app is null) logger.LogError(exception, "Unhandled exception");
        else logger.LogWarning("Request failed with {ErrorCode}", app.ErrorCode);

        context.Response.StatusCode = app?.StatusCode ?? 500;
        await context.Response.WriteAsJsonAsync(new ApiResponse<object>
        {
            Success = false,
            ErrorCode = app?.ErrorCode ?? ErrorCode.ServerError,
            Data = null
        }, cancellationToken);

        return true;
    }
}
