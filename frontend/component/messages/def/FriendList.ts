import type { IUserSummary } from "@/domain/meta/IUserSummary";

export interface IFriendListProps {
  friends: IUserSummary[];
  loading: boolean;
  selectedFriendId?: string;
  unreadCounts: Record<string, number>;
  onSelect: (friendId: string) => void;
  t: {
    search: string;
    noFriendsTitle: string;
    noFriendsDescription: string;
    message: string;
    viewProfile: string;
  };
}
