import type { IMessage } from "@/domain/meta/IMessage";
import type { TPromise } from "@/domain/type/TCommon";

interface IChatService {
  getMessagesByFriendId(friendId: string): TPromise<IMessage[]>;
}
export type { IChatService };
