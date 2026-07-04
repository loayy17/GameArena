import { friendsApi } from "../proxy/friends.api";
import type { TPromise } from "@/domain/type/TCommon";

import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IUser } from "@/domain/meta/IUser";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IFriendRepository } from "../meta/IFriendRepository";

class FriendRepository implements IFriendRepository {
  private static instance: FriendRepository;
  private api = friendsApi.api;

  sendFriendRequest(friendId: string): TPromise<void> {
    return this.api.sendFriendRequest({ friendId });
  }

  getReceivedFriendRequests(): TPromise<IFriendRequestReceived[]> {
    return this.api.getReceivedFriendRequests();
  }

  getSentFriendRequests(): TPromise<IFriendRequestSent[]> {
    return this.api.getSentFriendRequests();
  }

  getFriends(query: IUserFilterRequest): TPromise<IUser[]> {
    return this.api.getFriends(query);
  }

  acceptFriendRequest(senderId: string): TPromise<void> {
    return this.api.acceptFriendRequest({ senderId });
  }

  rejectFriendRequest(senderId: string): TPromise<void> {
    return this.api.rejectFriendRequest({ senderId });
  }

  removeFriend(friendId: string): TPromise<void> {
    return this.api.removeFriend({ friendId });
  }

  blockUser(blockedId: string): TPromise<void> {
    return this.api.blockUser({ blockedId });
  }

  unblockUser(blockedId: string): TPromise<void> {
    return this.api.unblockUser({ blockedId });
  }

  static getInstance() {
    if (!FriendRepository.instance) {
      FriendRepository.instance = new FriendRepository();
    }
    return FriendRepository.instance;
  }
}

export const friendRepository = FriendRepository.getInstance();
