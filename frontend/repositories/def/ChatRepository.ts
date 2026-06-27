import type { IMessage } from "@/domain/meta/IMessage";
import type { TPromise } from "@/types";
import { chatApi } from "../proxy/chat.api";
import type { IChatRepository } from "../meta/IChatRepository";

class ChatRepository implements IChatRepository {
  private static instance: ChatRepository;
  private api = chatApi.api;

  getMessagesByFriendId(id: string): TPromise<IMessage[]> {
    return this.api.getMessages({ friendId: id });
  }

  getUnreadMessageCount(): TPromise<number> {
    return this.api.getUnreadCount();
  }
  static getInstance() {
    if (!ChatRepository.instance) {
      ChatRepository.instance = new ChatRepository();
    }
    return ChatRepository.instance;
  }
}

export const chatRepository = ChatRepository.getInstance();
