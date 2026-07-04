namespace backend.Events;

public interface IEventBus
{
    Task PublishAsync<TEvent>(TEvent eventHappen) where TEvent : DomainEvent;
}
