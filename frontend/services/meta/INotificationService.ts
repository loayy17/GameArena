interface INotificationCounters {
  receivedFriendRequests: number;
  sentFriendRequests: number;
  friends: number;
  unreadMessages: number;
}

interface INotificationService {
  requestCounters(): Promise<void>;
  onCountersUpdate(handler: (data: INotificationCounters) => void): () => void;
  onChatNotification(handler: (data: { senderId: string; receiverId: string; content?: string; sentAt: string | Date }) => void): () => void;
}

export type { INotificationService, INotificationCounters };
