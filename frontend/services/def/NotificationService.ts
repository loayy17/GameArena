import type { HubConnection } from "@microsoft/signalr";
import type { INotificationService } from "../meta/INotificationService";
import type { Handler } from "../lib/signalRUtils";
import { requireConnection } from "../lib/signalRUtils";
import { SubscriptionManager } from "../lib/SubscriptionManager";

class NotificationService implements INotificationService {
  private connection: HubConnection | null = null;
  private subs = new SubscriptionManager();
  private reconnectHandlers = new Set<() => void>();

  handleReconnect(): void {
    this.requestCounters().catch(() => {});
    this.reconnectHandlers.forEach((h) => { try { h(); } catch { /* isolated */ } });
  }

  onReconnect(handler: () => void): () => void {
    this.reconnectHandlers.add(handler);
    return () => { this.reconnectHandlers.delete(handler); };
  }

  setConnection(connection: HubConnection): void {
    if (this.connection) {
      this.connection.off("notification:update");
      this.connection.off("chat:notification");
    }
    this.connection = connection;

    this.connection.on("notification:update", (data: unknown) => {
      this.subs.dispatch("notification:update", data);
    });

    this.connection.on("chat:notification", (data: unknown) => {
      this.subs.dispatch("chat:notification", data);
    });
  }

  async requestCounters(): Promise<void> {
    await requireConnection(this.connection, "Social").invoke("RequestCounters");
  }

  onCountersUpdate(handler: (data: { friendRequests: number; unreadMessages: number }) => void): () => void {
    return this.subs.subscribe("notification:update", handler as Handler);
  }

  onChatNotification(handler: (data: { senderId: string; receiverId: string; content?: string; sentAt: string | Date }) => void): () => void {
    return this.subs.subscribe("chat:notification", handler as Handler);
  }
}

const notificationService = new NotificationService();

export { notificationService };
