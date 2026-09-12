import type { TNullable } from "@/domain/type/TCommon";

interface IPrivateMessagePayload {
  id?: string;
  senderId: string;
  receiverId: string;
  content?: TNullable<string>;
  message?: TNullable<string>;
  sentAt: string | Date;
  isRead?: boolean;
}

export type { IPrivateMessagePayload };
