import type { IMessage } from "@/domain/meta/IMessage";
import type { IPerFriendUnreadCount } from "@/repositories/meta/IChatRepository";
import type { TPromise } from "@/domain/type/TCommon";

interface IChatService {
  getMessagesByFriendId(friendId: string): TPromise<IMessage[]>;
  sendMessage(receiverId: string, content: string): Promise<void>;
  getPerFriendUnreadCounts(): TPromise<IPerFriendUnreadCount[]>;
  onPrivateMessage(handler: (message: IMessage) => void): () => void;
}
export type { IChatService };
