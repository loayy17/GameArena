import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IUser } from "@/domain/meta/IUser";
import type { TPromise } from "@/domain/type/TCommon";

interface IFriendService {
  sendFriendRequest(friendId: string): TPromise<void>;
  getReceivedFriendRequests(): TPromise<IFriendRequestReceived[]>;
  getSentFriendRequests(): TPromise<IFriendRequestSent[]>;
  getFriends(data: IUserFilterRequest): TPromise<IUser[]>;
  acceptFriendRequest(senderId: string): TPromise<void>;
  rejectFriendRequest(senderId: string): TPromise<void>;
}
export type { IFriendService };
