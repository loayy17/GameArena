import type { IMessage } from "@/domain/meta/IMessage";
import type { TPromise } from "@/domain/type/TCommon";

interface IChatRepository {
  getMessagesByFriendId(friendId: string): TPromise<IMessage[]>;
  getUnreadMessageCount(): TPromise<number>;
}
export type { IChatRepository };
