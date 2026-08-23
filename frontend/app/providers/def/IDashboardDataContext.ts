import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { IGameInvite, INotificationItem } from "@/domain/meta/INotification";

interface IDashboardDataContext {
  friends: IUserSummary[];
  requests: IFriendRequestReceived[];
  sentRequests: IFriendRequestSent[];
  blockedUsers: IUserSummary[];
  friendsLoading: boolean;
  requestsLoading: boolean;
  blockedLoading: boolean;
  loading: boolean;
  isOffline: boolean;
  onlineCount: number;
  requestCount: number;
  sentRequestCount: number;
  blockedCount: number;
  friendRequestCount: number;
  unreadMessageCount: number;
  unreadNotificationCount: number;
  gameInvites: IGameInvite[];
  notifications: INotificationItem[];
  liveNotifications: INotificationItem[];
  markNotificationRead: (notificationId: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  sendRequest: (friendId: string) => Promise<void>;
  acceptRequest: (senderId: string) => Promise<void>;
  declineRequest: (senderId: string) => Promise<void>;
  cancelRequest: (receiverId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  blockUser: (blockedId: string) => Promise<void>;
  unblockUser: (blockedId: string) => Promise<void>;
  dismissGameInvite: (roomId: string) => void;
  acceptGameInvite: (roomId: string) => Promise<void>;
  reload: () => void;
}

export type { IDashboardDataContext };