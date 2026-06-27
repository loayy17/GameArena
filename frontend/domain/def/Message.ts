import { EMPTY_GUID, type TNullable } from "@/types";
import { IMessage } from "../meta/IMessage";

class Message implements IMessage {
  senderId: string;
  receiverId: string;
  content: TNullable<string>;
  sentAt: Date;
  isRead: boolean;
  constructor(
    senderId = EMPTY_GUID,
    receiverId = EMPTY_GUID,
    content: TNullable<string> = null,
    sentAt = new Date(),
    isRead = false,
  ) {
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.sentAt = sentAt;
    this.isRead = isRead;
  }
}

export { Message };
