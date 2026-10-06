namespace backend.Events;

public class EventBus(IServiceScopeFactory scopeFactory, ILogger<EventBus> logger) : IEventBus
{
    public async Task PublishAsync<TEvent>(TEvent domainEvent) where TEvent : DomainEvent
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        foreach (var handler in scope.ServiceProvider.GetServices<IEventHandler<TEvent>>())
        {
            try
            {
                await handler.HandleAsync(domainEvent);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Handler for {EventType} failed", typeof(TEvent).Name);
            }
        }
    }
}
