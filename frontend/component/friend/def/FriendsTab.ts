import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { IFriendRequestSent } from "@/domain/meta/IFriendRequestSent";
import type { TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";

type TFriendsTab = "friends" | "requests" | "sent" | "blocked" | "search";

interface FriendsListTabProps {
  friends: IUserSummary[];
  messageLabel: string;
  activeLabel: string;
  onMessage: (friendId: string) => void;
  onBlock: (friendId: string) => Promise<void>;
  onRemove: (friendId: string) => Promise<void>;
  onAddFriend: () => void;
  t: TFriendsTranslation;
}

interface RequestsTabProps {
  requests: IFriendRequestReceived[];
  onAccept: (senderId: string) => Promise<void>;
  onDecline: (senderId: string) => Promise<void>;
  t: TFriendsTranslation;
}

interface SentRequestsTabProps {
  sentRequests: IFriendRequestSent[];
  onCancel: (receiverId: string) => Promise<void>;
  t: TFriendsTranslation;
}

interface BlockedUsersTabProps {
  blockedUsers: IUserSummary[];
  onUnblock: (blockedId: string) => Promise<void>;
  t: TFriendsTranslation;
}

export type { TFriendsTab, FriendsListTabProps, RequestsTabProps, SentRequestsTabProps, BlockedUsersTabProps };