using System.Security.Cryptography;
using System.Text;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Utils;

namespace backend.Middleware;

public class PublicApiKeyMiddleware(RequestDelegate next, IConfiguration configuration)
{
    public async Task InvokeAsync(HttpContext context)
    {
        if (!context.Request.Path.StartsWithSegments(Constants.ProtectedPrefix))
        {
            await next(context);
            return;
        }

        var expected = configuration["PublicApi:ApiKey"];

        if (string.IsNullOrWhiteSpace(expected))
        {
            await RejectAsync(context, StatusCodes.Status500InternalServerError, ErrorCode.ServerError);
            return;
        }

        var provided = context.Request.Headers[Constants.HeaderName].ToString();
        if (string.IsNullOrEmpty(provided) || !Matches(provided, expected))
        {
            await RejectAsync(context, StatusCodes.Status401Unauthorized, ErrorCode.Unauthorized);
            return;
        }

        await next(context);
    }

    private static bool Matches(string provided, string expected) =>
        CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(provided),
            Encoding.UTF8.GetBytes(expected));

    private static async Task RejectAsync(HttpContext context, int statusCode, ErrorCode errorCode)
    {
        context.Response.StatusCode = statusCode;
        await context.Response.WriteAsJsonAsync(new ApiResponse<object>
        {
            Success = false,
            ErrorCode = errorCode,
            Data = null
        });
    }
}
