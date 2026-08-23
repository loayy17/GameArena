import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

interface IInviteModalProps {
  open: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loading: boolean;
  friends: IUserSummary[];
  onSelect: (friendId: string) => void;
  onClose: () => void;
  title: string;
  cancelLabel: string;
  searchPlaceholder: string;
  noFriendsText: string;
  pendingId?: TNullable<string>;
}

export type { IInviteModalProps };
