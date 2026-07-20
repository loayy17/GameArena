import type { IMessage } from "@/domain/meta/IMessage";
import type { TPromise } from "@/domain/type/TCommon";

interface IPerFriendUnreadCount {
  friendId: string;
  unreadCount: number;
}

interface IChatRepository {
  getMessagesByFriendId(friendId: string): TPromise<IMessage[]>;
  getPerFriendUnreadCounts(): TPromise<IPerFriendUnreadCount[]>;
}
export type { IChatRepository, IPerFriendUnreadCount };
