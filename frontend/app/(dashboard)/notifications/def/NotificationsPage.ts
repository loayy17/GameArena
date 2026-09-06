import type { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";

type TNotificationTab = "all" | "gameInvites" | "friendRequests";

interface INotificationListItem {
  id: string;
  type: NotificationTypeEnum;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  onAction?(): Promise<void>;
  onDismiss?(): Promise<void>;
  onClick?(): void;
}

export type { TNotificationTab, INotificationListItem };
