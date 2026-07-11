import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TPromise } from "@/domain/type/TCommon";

interface IFriendRepository {
  sendFriendRequest(friendId: string): TPromise<void>;
  getReceivedFriendRequests(): TPromise<IFriendRequestReceived[]>;
  getSentFriendRequests(): TPromise<IFriendRequestSent[]>;
  getFriends(data: IUserFilterRequest): TPromise<IUserSummary[]>;
  acceptFriendRequest(senderId: string): TPromise<void>;
  rejectFriendRequest(senderId: string): TPromise<void>;
  removeFriend(friendId: string): TPromise<void>;
  cancelFriendRequest(receiverId: string): TPromise<void>;
  blockUser(blockedId: string): TPromise<void>;
  unblockUser(blockedId: string): TPromise<void>;
  getBlockedUsers(): TPromise<IUserSummary[]>;
}
export type { IFriendRepository };
