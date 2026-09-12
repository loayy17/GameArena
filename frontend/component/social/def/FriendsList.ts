import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

export interface IFriendsListProps<T extends IUserSummary = IUserSummary> {
  friends: T[];
  query?: TNullable<string>;
  unreadCounts?: Record<string, number>;
  emptyMessage?: string;
  emptyDescription?: string;
  actions: (friend: T) => React.ReactNode;
}
