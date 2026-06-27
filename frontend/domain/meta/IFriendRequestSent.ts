import type { TNullable } from "@/types";

interface IFriendRequestSent {
  receiverId: string;
  receiverFirstName: TNullable<string>;
  receiverLastName: TNullable<string>;
  receiverUserName: TNullable<string>;
  sentAt: Date;
}
export type { IFriendRequestSent };
