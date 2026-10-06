using backend.Extensions;
using backend.Hubs;
using backend.Middleware;
using backend.Utils;
using DotNetEnv;
using Microsoft.AspNetCore.HttpOverrides;

Env.Load();

var builder = WebApplication.CreateBuilder(args).AddArena404();
var app = builder.Build();

if (app.Configuration.GetValue("ForwardedHeaders:Enabled", false))
{
    var forwarded = new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
    };
    forwarded.KnownProxies.Clear();
    forwarded.KnownIPNetworks.Clear();
    app.UseForwardedHeaders(forwarded);
}

if (!app.Configuration.GetValue("Swagger:Disabled", false))
{
    app.UseSwagger();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/swagger/v1/swagger.json", "Arena 404 API v1"));
}

await app.InitializeDatabaseAsync();

app.UseExceptionHandler();
app.UseCors("cors");
app.UseRateLimiter();
app.UseMiddleware<PublicApiKeyMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<GameHub>("/gameHub");
app.MapHub<SocialHub>("/socialHub");
app.MapHealthChecks("/api/health");

app.Run();
