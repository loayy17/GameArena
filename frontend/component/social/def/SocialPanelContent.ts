import type { useRouter } from "next/navigation";
import type { TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import type { SocialTabId } from "@/component/social/SocialTabs";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";
import type { INotificationItem, IGameInvite } from "@/domain/meta/INotification";

interface ISocialPanelContentProps {
  router: ReturnType<typeof useRouter>;
  activeTab: SocialTabId;
  friends: IUserSummary[];
  gameInvites: IGameInvite[];
  requests: IFriendRequestReceived[];
  notifications: INotificationItem[];
  loading: boolean;
  searchQuery: string;
  closeMobile: () => void;
  acceptRequest: (senderId: string) => Promise<void>;
  declineRequest: (senderId: string) => Promise<void>;
  t: TSocialPanelTranslation;
}

export type { ISocialPanelContentProps };
