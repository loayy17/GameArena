import type { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";
import type { TNullable } from "@/domain/type/TCommon";

interface INotificationItem {
  id: string;
  type: NotificationTypeEnum;
  title: string;
  body: string;
  referenceId: TNullable<string>;
  isRead: boolean;
  createdAt: string;
}

interface INotificationCounters {
  receivedFriendRequests: number;
  sentFriendRequests: number;
  friends: number;
  unreadMessages: number;
}

interface IGameInvite {
  roomId: string;
  gameType: number;
  inviterId: string;
  inviterName: TNullable<string>;
}

export type { IGameInvite, INotificationCounters, INotificationItem };
