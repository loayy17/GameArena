using backend.Events;
using backend.Events.Handlers;

namespace backend.Extensions;

public static class ServiceCollectionExtensions
{
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
