using backend.Utils;
using System.Text.Json;
namespace backend.Data
{

    public class GlobalExceptionMiddleware(RequestDelegate next)
    {
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
                var json = JsonSerializer.Serialize(error.value);
                await context.Response.WriteAsync(json);
            }
        }
    }
}
