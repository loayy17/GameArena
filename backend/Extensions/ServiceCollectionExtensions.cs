using backend.Events;
using backend.Events.Handlers;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace backend.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddDomainEventHandlers(this IServiceCollection services)
    {
        services.TryAddScoped<SocialNotificationHandler>();
        services.AddScoped<IEventHandler<FriendRequestSentEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<FriendRequestAcceptedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<FriendRequestDeclinedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<FriendRequestCancelledEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<FriendRemovedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<ChatMessageSentEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<GameStartedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<GameFinishedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<GameLeftEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<UserBlockedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<UserUnblockedEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        services.AddScoped<IEventHandler<GameInviteSentEvent>>(sp => sp.GetRequiredService<SocialNotificationHandler>());
        return services;
    }
}