import { friendRepository } from "@/repositories/def/FriendRepository";
import type { TPromise } from "@/domain/type/TCommon";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IUserFilterRequest } from "@/domain/meta/IUserFilterRequest";
import type { IFriendService } from "../meta/IFriendService";
import type { IFriendRepository } from "@/repositories/meta/IFriendRepository";

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

  async getFriends(data: IUserFilterRequest): TPromise<IUserSummary[]> {
    const result = await this.repo.getFriends(data);
    result.data?.forEach((friend) => {
      friend.fullName = `${friend.firstName ?? ""} ${friend.lastName ?? ""}`.trim();
    });
    return result;
  }

  acceptFriendRequest(senderId: string): TPromise<void> {
    return this.repo.acceptFriendRequest(senderId);
  }

  rejectFriendRequest(senderId: string): TPromise<void> {
    return this.repo.rejectFriendRequest(senderId);
  }

  removeFriend(friendId: string): TPromise<void> {
    return this.repo.removeFriend(friendId);
  }

  cancelFriendRequest(receiverId: string): TPromise<void> {
    return this.repo.cancelFriendRequest(receiverId);
  }

  blockUser(blockedId: string): TPromise<void> {
    return this.repo.blockUser(blockedId);
  }

  unblockUser(blockedId: string): TPromise<void> {
    return this.repo.unblockUser(blockedId);
  }

  getBlockedUsers(): TPromise<IUserSummary[]> {
    return this.repo.getBlockedUsers();
  }
}

const friendService = new FriendService(friendRepository);

export { friendService };
