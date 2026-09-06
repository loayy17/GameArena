import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

export interface IFriendsListProps {
  friends: IUserSummary[];
  query?: TNullable<string>;
  unreadCounts?: Record<string, number>;
  actions: (friend: IUserSummary) => React.ReactNode;
}
