import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface InviteModalProps {
  open: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loading: boolean;
  friends: IUserSummary[];
  onSelect: (friendId: string) => void;
  onClose: () => void;
  title?: string;
  cancelLabel?: string;
  searchPlaceholder?: string;
  noFriendsText?: string;
}

export type { InviteModalProps };
