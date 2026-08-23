import type { TNullable } from "@/domain/type/TCommon";

interface IFriendRequestSent {
  receiverId: string;
  receiverFirstName: TNullable<string>;
  receiverLastName: TNullable<string>;
  receiverUserName: TNullable<string>;
  receiverAvatarUrl?: TNullable<string>;
  sentAt: Date;
}
export type { IFriendRequestSent };
