namespace backend.Events;

public interface IEventHandler<TEvent> where TEvent : DomainEvent
{
    Task HandleAsync(TEvent eventHappen);
}
