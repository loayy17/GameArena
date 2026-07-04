namespace backend.Events;

public class EventBus(IServiceScopeFactory _scopeFactory) : IEventBus
{
    public async Task PublishAsync<TEvent>(TEvent eventHappen) where TEvent : DomainEvent
    {
        using var scope = _scopeFactory.CreateScope();
        var handlers = scope.ServiceProvider.GetServices<IEventHandler<TEvent>>();
        foreach (var handler in handlers)
        {
            await handler.HandleAsync(eventHappen);
        }
    }
}
