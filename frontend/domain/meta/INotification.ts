import type { TNullable } from "@/types";

interface IGameInvite {
  roomId: string;
  gameType: number;
  inviterId: string;
  inviterName: TNullable<string>;
}

interface INotificationState {
  friendRequestCount: number;
  unreadMessageCount: number;
  gameInvites: IGameInvite[];
  syncCounts: () => Promise<void>;
  refreshUnreadMessages: () => Promise<void>;
  refreshFriendRequests: () => Promise<void>;
  dismissGameInvite: (roomId: string) => void;
  acceptGameInvite: (roomId: string) => Promise<void>;
}

export type { IGameInvite, INotificationState };
