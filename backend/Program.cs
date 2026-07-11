using backend.Data;
using backend.Events;
using backend.Events.Handlers;
using backend.Hubs;
using backend.Services;
using backend.Services.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
// Authentication & Authorization
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

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SignalR
builder.Services.AddSignalR();

// CORS
// when deploying, change the origin to your frontend domain
builder.Services.AddCors(options =>
{
    options.AddPolicy("cors", policy =>
        policy.WithOrigins("http://localhost:3000")   // your Next.js frontend
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials());
});

// === Application Layer (Feature Services) ===
builder.Services.AddHttpClient();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IEmailVerificationService, EmailVerificationService>();
builder.Services.AddScoped<IFriendService, FriendService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IMatchHistoryService, MatchHistoryService>();

// Event bus this for notification system like friend request, game invitation, message notification, user online/offline status.
builder.Services.AddSingleton<IEventBus, EventBus>();
builder.Services.AddScoped<SocialNotificationHandler>();
builder.Services.AddScoped<IEventHandler<FriendRequestSentEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>()); // requst sent
builder.Services.AddScoped<IEventHandler<FriendRequestAcceptedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>()); // request accepted
builder.Services.AddScoped<IEventHandler<FriendRequestDeclinedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>()); // request declined
builder.Services.AddScoped<IEventHandler<FriendRequestCancelledEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>()); // request cancelled
builder.Services.AddScoped<IEventHandler<FriendRemovedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
builder.Services.AddScoped<IEventHandler<ChatMessageSentEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
builder.Services.AddScoped<IEventHandler<GameStartedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
builder.Services.AddScoped<IEventHandler<GameFinishedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
builder.Services.AddScoped<IEventHandler<GameLeftEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
builder.Services.AddScoped<IEventHandler<UserBlockedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddSingleton<IUserPresenceService, UserPresenceService>();
builder.Services.AddSingleton<IGameRoomService, GameRoomService>();
var app = builder.Build();
app.UseSwagger();
app.UseSwaggerUI();
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
app.MapHub<ChatHub>("/chatHub");
app.MapHub<GameHub>("/gameHub");
app.MapHub<SocialHub>("/socialHub");

app.Run();
