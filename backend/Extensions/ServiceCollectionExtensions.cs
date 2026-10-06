using backend.Data;
using backend.Domain;
using backend.Events;
using backend.Events.Handlers;
using backend.Services;
using backend.Services.Interface;
using backend.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Extensions;

public static class ServiceCollectionExtensions
{

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IEmailVerificationService, EmailVerificationService>();
        services.AddScoped<IFriendService, FriendService>();
        services.AddScoped<ISocialReadService, SocialReadService>();
        services.AddScoped<IChatService, ChatService>();
        services.AddScoped<IMatchHistoryService, MatchHistoryService>();
        services.AddScoped<INotificationService, NotificationService>();
        services.AddScoped<IFeedbackService, FeedbackService>();
        services.AddScoped<IGameSessionService, GameSessionService>();

        services.AddSingleton<IUserPresenceService, UserPresenceService>();
        services.AddSingleton<IGameRoomService, GameRoomService>();
        services.AddSingleton<IEventBus, EventBus>();

        return services;
    }

    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddHttpContextAccessor();
        services.AddMemoryCache();

        services.AddDbContextFactory<AppDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")), ServiceLifetime.Scoped);

        services.AddHttpClient("Brevo", client =>
        {
            client.BaseAddress = new Uri("https://api.brevo.com/v3/smtp/");
            client.DefaultRequestHeaders.Add("api-key", configuration["EmailSettings:Password"]);
        });

        return services;
    }

    public static IServiceCollection AddAuthPrimitives(this IServiceCollection services)
    {
        services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
        services.AddSingleton<ITokenService, TokenService>();
        services.AddSingleton<IAuthCookieHelper, AuthCookieHelper>();

        return services;
    }

    public static IServiceCollection AddDomainEventHandlers(this IServiceCollection services)
    {
        services.AddScoped<IEventHandler<FriendRequestSentEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<FriendRequestAcceptedEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<FriendRequestDeclinedEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<FriendRequestCancelledEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<FriendRemovedEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<ChatMessageSentEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<GameStartedEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<GameFinishedEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<GameLeftEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<UserBlockedEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<UserUnblockedEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<GameInviteSentEvent>, SocialNotificationHandler>();
        services.AddScoped<IEventHandler<GameInviteCancelledEvent>, SocialNotificationHandler>();

        return services;
    }
}
