import { SignalRServiceBase } from "../lib/SignalR";

import type { INotificationCounters, INotificationItem } from "@/domain/meta/INotification";
import type { Handler } from "../lib/SignalR";

class NotificationService extends SignalRServiceBase {
  protected registerHandlers(): void {
    this.addHandler("notification:update", (data: unknown) => this.subs.dispatch("notification:update", data));
    this.addHandler("chat:notification", (data: unknown) => this.subs.dispatch("chat:notification", data));
    this.addHandler("notification:new", (data: unknown) => this.subs.dispatch("notification:new", data));
    this.addHandler("notification:list", (data: unknown) => this.subs.dispatch("notification:list", data));
  }

  async requestCounters() {
    await this.requireConnection("Social").invoke("RequestCounters");
  }

  async requestNotificationList(limit = 50) {
    await this.requireConnection("Social").invoke("RequestNotifications", limit);
  }

  async markNotificationRead(notificationId: string) {
    await this.requireConnection("Social").invoke("MarkNotificationRead", notificationId);
  }

  async markAllNotificationsRead() {
    await this.requireConnection("Social").invoke("MarkAllNotificationsRead");
  }

  async deleteNotification(notificationId: string) {
    await this.requireConnection("Social").invoke("DeleteNotification", notificationId);
  }

  onCountersUpdate(handler: (data: INotificationCounters) => void) {
    return this.subscribe("notification:update", handler as Handler);
  }

  onChatNotification(handler: (data: { senderId: string; receiverId: string; content?: string; sentAt: string | Date }) => void) {
    return this.subscribe("chat:notification", handler as Handler);
  }

  onNewNotification(handler: (data: INotificationItem) => void) {
    return this.subscribe("notification:new", handler as Handler);
  }

  onNotificationList(handler: (data: INotificationItem[]) => void) {
    return this.subscribe("notification:list", handler as Handler);
  }
}

const notificationService = new NotificationService();
export { notificationService };
