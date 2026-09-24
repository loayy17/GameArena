using System.Security.Cryptography;
using System.Text;
using backend.DTOs.Responses;
using backend.Enums;

namespace backend.Middleware
{
    public class PublicApiKeyMiddleware(RequestDelegate _next, IConfiguration _configuration)
    {
        public async Task InvokeAsync(HttpContext context)
        {
            if (!context.Request.Path.StartsWithSegments("/api/public"))
            {
                await _next(context);
                return;
            }

            var expected = _configuration["PublicApi:ApiKey"];

            if (string.IsNullOrWhiteSpace(expected))
            {
                await WriteEnvelopeAsync(context, StatusCodes.Status500InternalServerError, ErrorCode.ServerError);
                return;
            }

            var provided = context.Request.Headers["X-Api-Key"].ToString();
            if (string.IsNullOrEmpty(provided) ||
                !CryptographicOperations.FixedTimeEquals(
                    Encoding.UTF8.GetBytes(provided),
                    Encoding.UTF8.GetBytes(expected)))
            {
                await WriteEnvelopeAsync(context, StatusCodes.Status401Unauthorized, ErrorCode.Unauthorized);
                return;
            }

            await _next(context);
        }

        private static async Task WriteEnvelopeAsync(HttpContext context, int statusCode, ErrorCode errorCode)
        {
            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(
                new ApiResponse<object>
                {
                    Success = false,
                    ErrorCode = errorCode,
                    Data = null
                });
        }
    }
}