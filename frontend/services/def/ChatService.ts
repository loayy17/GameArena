import type { HubConnection } from "@microsoft/signalr";
import type { IMessage } from "@/domain/meta/IMessage";
import type { IPrivateMessagePayload } from "@/domain/meta/IPrivateMessagePayload";
import type { TPromise } from "@/domain/type/TCommon";
import type { IChatService } from "../meta/IChatService";
import type { IChatRepository } from "@/repositories/meta/IChatRepository";
import { chatRepository } from "@/repositories/def/ChatRepository";
import type { Handler } from "../lib/signalRUtils";
import { requireConnection } from "../lib/signalRUtils";
import { SubscriptionManager } from "../lib/SubscriptionManager";

const normalizeMessage = (payload: IPrivateMessagePayload): IMessage => ({
  senderId: payload.senderId,
  receiverId: payload.receiverId,
  content: payload.content ?? payload.message ?? "",
  sentAt: new Date(payload.sentAt),
  isRead: payload.isRead ?? false,
});

class ChatService implements IChatService {
  private connection: HubConnection | null = null;
  private subs = new SubscriptionManager();
  private reconnectHandlers = new Set<() => void>();

  constructor(private repo: IChatRepository) {}

  handleReconnect(): void {
    this.reconnectHandlers.forEach((h) => { try { h(); } catch { /* isolated */ } });
  }

  onReconnect(handler: () => void): () => void {
    this.reconnectHandlers.add(handler);
    return () => { this.reconnectHandlers.delete(handler); };
  }

  setConnection(connection: HubConnection): void {
    if (this.connection) {
      this.connection.off("chat:private");
    }
    this.connection = connection;

    this.connection.on("chat:private", (data: unknown) => {
      this.subs.dispatch("chat:private", normalizeMessage(data as IPrivateMessagePayload));
    });
  }

  getMessagesByFriendId(friendId: string): TPromise<IMessage[]> {
    return this.repo.getMessagesByFriendId(friendId);
  }

  async sendMessage(receiverId: string, content: string): Promise<void> {
    const conn = requireConnection(this.connection, "Chat");
    await conn.invoke("SendPrivateMessage", receiverId, content);
  }

  onPrivateMessage(handler: (message: IMessage) => void): () => void {
    return this.subs.subscribe("chat:private", handler as Handler);
  }
}

const chatService = new ChatService(chatRepository);

export { chatService };
