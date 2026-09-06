import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

interface IConversationHeaderProps {
  friend: TNullable<IUserSummary>;
  friendId: string;
  statusClass: string;
  statusLabel: string;
  isConnected: boolean;
  disconnectedLabel?: string;
  backLabel: string;
  onBack: () => void;
  inviteLabel?: string;
}

export type { IConversationHeaderProps };
