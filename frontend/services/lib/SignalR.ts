import type { HubConnection } from "@microsoft/signalr";
import type { TNullable, TOptional } from "@/domain/type/TCommon";

type Handler = (...args: unknown[]) => void;

function dispatch(handlers: TOptional<Set<Handler>>, ...args: unknown[]): void {
  if (!handlers) return;
  for (const h of handlers) {
    try {
      h(...args);
    } catch {}
  }
}

function requireConnection(connection: TNullable<HubConnection>, name: string): HubConnection {
  if (!connection) throw new Error(`${name} connection not established`);
  return connection;
}

class SubscriptionManager {
  private handlers = new Map<string, Set<Handler>>();

  subscribe(event: string, handler: Handler): () => void {
    let set = this.handlers.get(event);
    if (!set) {
      set = new Set();
      this.handlers.set(event, set);
    }
    const handlerSet = set;
    handlerSet.add(handler);
    return () => {
      handlerSet.delete(handler);
      if (handlerSet.size === 0) {
        this.handlers.delete(event);
      }
    };
  }

  dispatch(event: string, ...args: unknown[]): void {
    dispatch(this.handlers.get(event), ...args);
  }
}

interface RegisteredHandler {
  event: string;
  handler: Handler;
}

abstract class SignalRServiceBase {
  protected connection: TNullable<HubConnection> = null;
  protected subs = new SubscriptionManager();
  private handlers: RegisteredHandler[] = [];

  setConnection(connection: HubConnection): void {
    this.unregisterHandlers();
    this.connection = connection;
    this.registerHandlers();
  }

  disconnect(): void {
    this.unregisterHandlers();
    this.connection = null;
  }

  protected requireConnection(name: string): HubConnection {
    return requireConnection(this.connection, name);
  }

  protected subscribe(key: string, handler: Handler): () => void {
    return this.subs.subscribe(key, handler);
  }

  protected addHandler(event: string, handler: Handler): void {
    this.connection!.on(event, handler);
    this.handlers.push({ event, handler });
  }

  private unregisterHandlers(): void {
    for (const { event, handler } of this.handlers) {
      this.connection?.off(event, handler);
    }
    this.handlers = [];
  }

  protected abstract registerHandlers(): void;
}

export { SignalRServiceBase };
export type { Handler };
