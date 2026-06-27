import type { TNullable } from "@/types";

interface IFriendRequestReceived {
  senderId: string;
  senderFirstName: TNullable<string>;
  senderLastName: TNullable<string>;
  senderUserName: TNullable<string>;
  sentAt: Date;
}

export type { IFriendRequestReceived };
