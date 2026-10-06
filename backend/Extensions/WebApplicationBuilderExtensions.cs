using System.Text;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.RateLimiting;
using backend.Data;
using backend.Domain;
using backend.DTOs.Responses;
using backend.Enums;
using backend.Middleware;
using backend.Services;
using backend.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

namespace backend.Extensions;

public static class WebApplicationBuilderExtensions
{
    public static WebApplicationBuilder AddArena404(this WebApplicationBuilder builder)
    {
        var configuration = builder.Configuration;

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Arena 404 API", Version = "v1" }));

        builder.Services.AddPersistence(configuration);
        builder.Services.AddAuthPrimitives();
        builder.Services.AddApplicationServices();
        builder.Services.AddDomainEventHandlers();

        builder.Services.AddArena404Authentication(configuration);
        builder.Services.AddArena404Cors(configuration, builder.Environment);
        builder.Services.AddArena404RateLimiting(configuration);

        builder.Services.AddSignalR()
            .AddJsonProtocol(options =>
                options.PayloadSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull);

        builder.Services.AddHealthChecks().AddDbContextCheck<AppDbContext>();
        builder.Services.AddProblemDetails();
        builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
        return builder;
    }

    private static void AddArena404Authentication(this IServiceCollection services, IConfiguration configuration)
    {
        var issuer = configuration["JWT:Issuer"] ?? throw new InvalidOperationException("JWT:Issuer is not configured");
        var audience = configuration["JWT:Audience"] ?? throw new InvalidOperationException("JWT:Audience is not configured");
        var key = configuration["JWT:Token"] ?? throw new InvalidOperationException("JWT:Token is not configured");

        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = issuer,
                    ValidateAudience = true,
                    ValidAudience = audience,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key))
                };

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = context =>
                    {
                        var token = context.Request.Cookies[Constants.Access];
                        if (!string.IsNullOrEmpty(token)) context.Token = token;
                        return Task.CompletedTask;
                    }
                };
            });
    }

    private static void AddArena404Cors(this IServiceCollection services, IConfiguration configuration, IHostEnvironment environment)
    {
        services.AddCors(options => options.AddPolicy("cors", policy =>
        {
            var origins = configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
            if (environment.IsDevelopment()) origins = [.. origins, "http://localhost:3000"];
            policy.WithOrigins(origins.Distinct().ToArray())
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }));
    }

    private static void AddArena404RateLimiting(this IServiceCollection services, IConfiguration configuration)
    {
        const int authPermits = 10;
        const int authWindowSeconds = 60;
        const int sessionPermits = 60;
        const int sessionWindowSeconds = 60;
        int apiPermits = ReadInt(configuration, "PublicApi:PermitLimit", 60);
        int apiWindowSeconds = ReadInt(configuration, "PublicApi:WindowSeconds", 60);
        services.AddRateLimiter(options =>
        {
            options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
            options.OnRejected = async (context, cancellationToken) =>
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                await context.HttpContext.Response.WriteAsJsonAsync(
                    new ApiResponse<object>
                    {
                        Success = false,
                        ErrorCode = ErrorCode.RateLimited,
                        Data = null
                    },
                    cancellationToken);
            };

            options.AddPolicy("AuthPolicy", context => FixedWindow(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                authPermits, authWindowSeconds));

            options.AddPolicy("SessionPolicy", context => FixedWindow(
                context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
                sessionPermits, sessionWindowSeconds));

            options.AddPolicy("PublicApi", context =>
            {
                var apiKey = context.Request.Headers["X-Api-Key"].ToString();
                return FixedWindow(
                    string.IsNullOrEmpty(apiKey) ? context.Connection.RemoteIpAddress?.ToString() ?? "unknown" : apiKey,
                    apiPermits, apiWindowSeconds);
            });
        });
    }

    private static int ReadInt(IConfiguration configuration, string key, int fallback) =>
        int.TryParse(configuration[key], out var value) ? value : fallback;
    public static async Task InitializeDatabaseAsync(this WebApplication app)
    {
        await using var scope = app.Services.CreateAsyncScope();
        var services = scope.ServiceProvider;
        var context = services.GetRequiredService<AppDbContext>();
        await context.Database.MigrateAsync();
        var email = app.Configuration["SuperAdmin:Email"]?.Trim();
        var password = app.Configuration["SuperAdmin:Password"];
        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) return;
        if (!Regex.IsMatch(password, Constants.PasswordPattern))
            throw new InvalidOperationException(
                "SuperAdmin__Password does not meet the password policy: 8-64 characters with an uppercase letter, "
                + "a lowercase letter, a digit and a symbol");

        var userName = app.Configuration["SuperAdmin:UserName"]?.Trim();
        var hasher = services.GetRequiredService<IPasswordHasher<User>>();
        var user = await context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
        {
            user = new User
            {
                UserName = string.IsNullOrEmpty(userName) ? email.Split('@')[0] : userName,
                Email = email,
                FirstName = "Super",
                LastName = "Admin",
                Rank = 0
            };
            context.Users.Add(user);
        }
        else if (user.Role == UserRole.SuperAdmin)
            return;

        user.Role = UserRole.SuperAdmin;
        user.IsVerified = true;
        user.PasswordHash = hasher.HashPassword(user, password);
        await context.SaveChangesAsync();
    }

    private static RateLimitPartition<string> FixedWindow(string partitionKey, int permitLimit, int windowSeconds) =>
        RateLimitPartition.GetFixedWindowLimiter(partitionKey, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = permitLimit,
            Window = TimeSpan.FromSeconds(windowSeconds),
            QueueLimit = 0
        });
}

