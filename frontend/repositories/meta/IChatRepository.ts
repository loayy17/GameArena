import type { IMessage } from "@/domain/meta/IMessage";
import type { TPromise } from "@/types";

interface IChatRepository {
  getMessagesByFriendId(friendId: string): TPromise<IMessage[]>;
  getUnreadMessageCount(): TPromise<number>;
}
export type { IChatRepository };
