import type { TPromise } from "@/domain/type/TCommon";

import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IFriendService } from "../meta/IFriendService";
import type { IFriendRepository } from "@/repositories/meta/IFriendRepository";
import { friendRepository } from "@/repositories/def/FriendRepository";

class FriendService implements IFriendService {
  constructor(private repo: IFriendRepository) {}

  sendFriendRequest(friendId: string): TPromise<void> {
    return this.repo.sendFriendRequest(friendId);
  }

  getReceivedFriendRequests(): TPromise<IFriendRequestReceived[]> {
    return this.repo.getReceivedFriendRequests();
  }

  getSentFriendRequests(): TPromise<IFriendRequestSent[]> {
    return this.repo.getSentFriendRequests();
  }

  getFriends(data: IUserFilterRequest): TPromise<IUser[]> {
    return this.repo.getFriends(data);
  }

  acceptFriendRequest(senderId: string): TPromise<void> {
    return this.repo.acceptFriendRequest(senderId);
  }

  rejectFriendRequest(senderId: string): TPromise<void> {
    return this.repo.rejectFriendRequest(senderId);
  }
}

const friendService = new FriendService(friendRepository);

export { friendService };
