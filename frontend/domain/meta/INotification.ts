import type { TNullable } from "@/domain/type/TCommon";

interface INotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  referenceId: string | null;
  isRead: boolean;
  createdAt: string;
}

interface IGameInvite {
  roomId: string;
  gameType: number;
  inviterId: string;
  inviterName: TNullable<string>;
}

interface INotificationState {
  friendRequestCount: number;
  unreadMessageCount: number;
  unreadNotificationCount: number;
  gameInvites: IGameInvite[];
  notifications: INotificationItem[];
  dismissGameInvite: (roomId: string) => void;
  acceptGameInvite: (roomId: string) => Promise<void>;
}

export type { IGameInvite, INotificationItem, INotificationState };
