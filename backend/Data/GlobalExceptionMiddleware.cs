using backend.Utils;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace backend.Data
{
    public class GlobalExceptionMiddleware(RequestDelegate next)
    {
        // used for make the json response camelCase instead of PascalCase
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
                Console.WriteLine(ex);
                var error = ErrorHelper.GetErrorResponse(ex);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = error.StatusCode;
                var json = JsonSerializer.Serialize(error.value, _jsonOptions);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
