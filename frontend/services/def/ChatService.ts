import { SignalRServiceBase } from "../lib/SignalRServiceBase";
import { chatApi } from "@/repositories/proxy/chat.api";
import type { IMessage } from "@/domain/meta/IMessage";
import type { IPrivateMessagePayload } from "@/domain/meta/IPrivateMessagePayload";
import type { TPromise } from "@/domain/type/TCommon";
import type { IPerFriendUnreadCount } from "@/domain/meta/IPerFriendUnreadCount";
import type { Handler } from "../lib/signalRUtils";

const normalizeMessage = (payload: IPrivateMessagePayload): IMessage => ({
  senderId: payload.senderId,
  receiverId: payload.receiverId,
  content: payload.content ?? payload.message ?? "",
  sentAt: new Date(payload.sentAt),
  isRead: payload.isRead ?? false,
});

class ChatService extends SignalRServiceBase {
  private api = chatApi.api;

  protected registerHandlers(): void {
    this.addHandler("chat:private", (data: unknown) => {
      this.subs.dispatch("chat:private", normalizeMessage(data as IPrivateMessagePayload));
    });

    this.addHandler("chat:typing", (data: unknown) => {
      this.subs.dispatch("chat:typing", data as { senderId: string; receiverId: string });
    });
  }

  getMessagesByFriendId(friendId: string, signal?: AbortSignal): TPromise<IMessage[]> {
    return this.api.getMessages<IMessage[]>({ friendId }, { signal });
  }

  getPerFriendUnreadCounts(): TPromise<IPerFriendUnreadCount[]> {
    return this.api.perFriendUnreadCounts<IPerFriendUnreadCount[]>();
  }

  async sendMessage(receiverId: string, content: string): Promise<void> {
    await this.requireConnection("Social").invoke("SendPrivateMessage", receiverId, content);
  }

  async sendTyping(receiverId: string): Promise<void> {
    await this.requireConnection("Social").invoke("SendTyping", receiverId);
  }

  onPrivateMessage(handler: (message: IMessage) => void): () => void {
    return this.subscribe("chat:private", handler as Handler);
  }

  onTyping(handler: (data: { senderId: string; receiverId: string }) => void): () => void {
    return this.subscribe("chat:typing", handler as Handler);
  }
}

export const chatService = new ChatService();
