using backend.Utils;
using System.Text.Json;

namespace backend.Data
{
    public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> _logger)
    {
        private static readonly JsonSerializerOptions _jsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        };

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (Exception ex)
            {
                // this only for debugginh in production
                _logger.LogError(ex, "Unhandled exception");
                var error = ErrorHelper.GetErrorResponse(ex);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = error.StatusCode;
                var json = JsonSerializer.Serialize(error.Value, _jsonOptions);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
