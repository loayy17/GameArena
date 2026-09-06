import type { IMessage } from "@/domain/meta/IMessage";

export interface IMessageBubbleProps {
  message: IMessage;
  outgoing: boolean;
}

export interface IMessageListProps {
  messages: IMessage[];
  selectedFriendId: string;
  loading: boolean;
  typing?: boolean;
  error?: string;
  errorTitle: string;
  emptyTitle: string;
  emptyDescription: string;
  retryLabel?: string;
  onRetry?: () => void;
}
