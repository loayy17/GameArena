import type { TNullable } from "@/domain/type/TCommon";

interface IFriendRequestReceived {
  senderId: string;
  senderFirstName: TNullable<string>;
  senderLastName: TNullable<string>;
  senderFullName: TNullable<string>;
  senderUserName: TNullable<string>;
  senderAvatarUrl?: TNullable<string>;
  sentAt: Date;
}

export type { IFriendRequestReceived };
