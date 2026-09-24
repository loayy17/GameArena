using backend.Utils;
using Microsoft.AspNetCore.Diagnostics;

namespace backend.Middleware
{
    public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> _logger) : IExceptionHandler
    {
        public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
        {
            if (exception is AppException appException)
                _logger.LogWarning("Request failed with application error ${ErrorCode}", appException.ErrorCode);
            else
                _logger.LogError(exception, "Unhandled exception");

            var error = ErrorHelper.GetErrorResponse(exception);
            context.Response.StatusCode = error.StatusCode;
            await context.Response.WriteAsJsonAsync(error.Value, cancellationToken);
            return true;
        }
    }
}
