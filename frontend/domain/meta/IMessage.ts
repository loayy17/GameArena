import type { TNullable } from "@/types";

interface IMessage {
  senderId: string;
  receiverId: string;
  content: TNullable<string>;
  sentAt: Date;
  isRead: boolean;
}

export type { IMessage };
