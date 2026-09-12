using backend.Data;
using backend.Events;
using backend.Extensions;
using backend.Hubs;
using backend.Middleware;
using backend.Services;
using backend.Services.Interface;
using backend.Utils;
using DotNetEnv;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonDefaults.Options.PropertyNamingPolicy;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonDefaults.Options.DefaultIgnoreCondition;
    });


builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContextFactory<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")), ServiceLifetime.Scoped);
var jwtKey = builder.Configuration["JWT:Token"]
    ?? throw new InvalidOperationException("JWT:Token is not configured");
var jwtIssuer = builder.Configuration["JWT:Issuer"]
    ?? throw new InvalidOperationException("JWT:Issuer is not configured");
var jwtAudience = builder.Configuration["JWT:Audience"]
    ?? throw new InvalidOperationException("JWT:Audience is not configured");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = true,
            ValidAudience = jwtAudience,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            )
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["access_token"];
                if (!string.IsNullOrEmpty(token))
                    context.Token = token;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR()
    .AddJsonProtocol(options =>
    {
        options.PayloadSerializerOptions.PropertyNamingPolicy = JsonDefaults.Options.PropertyNamingPolicy;
        options.PayloadSerializerOptions.DefaultIgnoreCondition = JsonDefaults.Options.DefaultIgnoreCondition;
    });
builder.Services.AddCors(options =>
{
    options.AddPolicy("cors", policy =>
    {
        var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];

        if (builder.Environment.IsDevelopment())
            origins = [.. origins, "http://localhost:3000"];

        policy.WithOrigins(origins.Distinct().ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});
builder.Services.AddHttpClient("Brevo", client =>
{
    client.BaseAddress = new Uri("https://api.brevo.com/v3/smtp/");
    client.DefaultRequestHeaders.Add("api-key", builder.Configuration["EmailSettings:Password"]);
});
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEmailVerificationService, EmailVerificationService>();
builder.Services.AddScoped<IFriendService, FriendService>();
builder.Services.AddScoped<ISocialReadService, SocialReadService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IMatchHistoryService, MatchHistoryService>();
builder.Services.AddScoped<IHealthService, HealthService>();
builder.Services.AddSingleton<IEventBus, EventBus>();
builder.Services.AddDomainEventHandlers();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddSingleton<IUserPresenceService, UserPresenceService>();
builder.Services.AddSingleton<IGameRoomService, GameRoomService>();
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}
app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors("cors");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<GameHub>("/gameHub");
app.MapHub<SocialHub>("/socialHub");

app.Run();
