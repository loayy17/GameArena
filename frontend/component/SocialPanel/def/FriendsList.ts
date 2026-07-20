import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

interface IFriendsListProps {
  friends: IUserSummary[];
  query?: TNullable<string>;
  messageLabel?: string;
  activeLabel?: string;
  unreadCounts?: Record<string, number>;
  actions?: (friend: IUserSummary) => React.ReactNode;
}

export type { IFriendsListProps };
