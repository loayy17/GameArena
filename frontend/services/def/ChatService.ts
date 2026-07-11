import type { IMessage } from "@/domain/meta/IMessage";
import type { TPromise } from "@/domain/type/TCommon";

import type { IChatService } from "../meta/IChatService";
import type { IChatRepository } from "@/repositories/meta/IChatRepository";
import { chatRepository } from "@/repositories/def/ChatRepository";

class ChatService implements IChatService {
  constructor(private repo: IChatRepository) {}

  getMessagesByFriendId(friendId: string): TPromise<IMessage[]> {
    return this.repo.getMessagesByFriendId(friendId);
  }
}

const chatService = new ChatService(chatRepository);

export { chatService };
