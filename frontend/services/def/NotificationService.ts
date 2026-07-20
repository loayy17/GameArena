import type { HubConnection } from "@microsoft/signalr";
import type { INotificationCounters, INotificationService } from "../meta/INotificationService";
import type { INotificationItem } from "@/domain/meta/INotification";
import type { Handler } from "../lib/signalRUtils";
import { requireConnection } from "../lib/signalRUtils";
import { SubscriptionManager } from "../lib/SubscriptionManager";

class NotificationService implements INotificationService {
  private connection: HubConnection | null = null;
  private subs = new SubscriptionManager();
  private reconnectHandlers = new Set<() => void>();

  handleReconnect(): void {
    this.requestCounters().catch(() => {});
    this.requestNotificationList().catch(() => {});
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
      this.connection.off("notification:new");
      this.connection.off("notification:list");
    }
    this.connection = connection;

    this.connection.on("notification:update", (data: unknown) => this.subs.dispatch("notification:update", data));
    this.connection.on("chat:notification", (data: unknown) => this.subs.dispatch("chat:notification", data));
    this.connection.on("notification:new", (data: unknown) => this.subs.dispatch("notification:new", data));
    this.connection.on("notification:list", (data: unknown) => this.subs.dispatch("notification:list", data));
  }

  async requestCounters() {
    await requireConnection(this.connection, "Social").invoke("RequestCounters");
  }

  async requestNotificationList(limit = 50) {
    await requireConnection(this.connection, "Social").invoke("RequestNotifications", limit);
  }

  async markNotificationRead(notificationId: string) {
    await requireConnection(this.connection, "Social").invoke("MarkNotificationRead", notificationId);
  }

  async markAllNotificationsRead() {
    await requireConnection(this.connection, "Social").invoke("MarkAllNotificationsRead");
  }

  async deleteNotification(notificationId: string) {
    await requireConnection(this.connection, "Social").invoke("DeleteNotification", notificationId);
  }

  onCountersUpdate(handler: (data: INotificationCounters) => void) {
    return this.subs.subscribe("notification:update", handler as Handler);
  }

  onChatNotification(handler: (data: { senderId: string; receiverId: string; content?: string; sentAt: string | Date }) => void) {
    return this.subs.subscribe("chat:notification", handler as Handler);
  }

  onNewNotification(handler: (data: INotificationItem) => void) {
    return this.subs.subscribe("notification:new", handler as Handler);
  }

  onNotificationList(handler: (data: INotificationItem[]) => void) {
    return this.subs.subscribe("notification:list", handler as Handler);
  }
}

const notificationService = new NotificationService();
export { notificationService };
