import { EMPTY_GUID, type TNullable } from "@/types";
import type { IFriendRequestSent } from "../meta/IFriendRequestSent";

class FriendRequestSent implements IFriendRequestSent {
  receiverId: string;
  receiverFirstName: TNullable<string>;
  receiverLastName: TNullable<string>;
  receiverUserName: TNullable<string>;
  sentAt: Date;
  constructor(
    receiverId = EMPTY_GUID,
    receiverFirstName = null,
    receiverLastName = null,
    receiverUserName = null,
    sentAt = new Date(),
  ) {
    this.receiverId = receiverId;
    this.receiverFirstName = receiverFirstName;
    this.receiverLastName = receiverLastName;
    this.receiverUserName = receiverUserName;
    this.sentAt = new Date(sentAt);
  }
}

export { FriendRequestSent };
