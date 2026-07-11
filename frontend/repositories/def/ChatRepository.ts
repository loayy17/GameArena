import type { IMessage } from "@/domain/meta/IMessage";
import { chatApi } from "../proxy/chat.api";
import type { IChatRepository } from "../meta/IChatRepository";
import type { TPromise } from "@/domain/type/TCommon";

class ChatRepository implements IChatRepository {
  private static instance: ChatRepository;
  private api = chatApi.api;

  getMessagesByFriendId(id: string): TPromise<IMessage[]> {
    return this.api.getMessages({ friendId: id });
  }

  static getInstance() {
    if (!ChatRepository.instance) {
      ChatRepository.instance = new ChatRepository();
    }
    return ChatRepository.instance;
  }
}

export const chatRepository = ChatRepository.getInstance();
