"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

import { useTranslation } from "@/hooks/useSetting";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useAside } from "@/hooks/useAside";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { fr } from "@/component/i18n/SocialPanel/fr.i18n";
import { GIcon } from "@/component/common/GIcon";
import { GTextField } from "@/component/common/GTextField";
import { GModal } from "@/component/common/GModal";
import { SocialPanelHeader } from "../social/SocialPanelHeader";
import { SocialTabs, SocialTabId } from "../social/SocialTabs";
import { SocialPanelContent } from "./SocialPanelContent";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { ISocialPanelProps } from "./def/SocialPanel";

function SocialPanel({ aside: asideProp }: ISocialPanelProps) {
  const router = useRouter();
  const t = useTranslation({ en, ar, fr }) as TSocialPanelTranslation;
  const {
    friendRequestCount,
    unreadMessageCount,
    unreadNotificationCount,
    gameInvites,
    notifications,
    friends,
    requests,
    loading,
    acceptRequest,
    declineRequest,
  } = useDashboardData();
  const asideDefault = useAside(false);
  const aside = asideProp ?? asideDefault;

  const [activeTab, setActiveTab] = useState<SocialTabId>(SocialTabId.Friends);
  const [searchQuery, setSearchQuery] = useState("");

  const onlineCount = friends.filter((f) => f.status !== UserStatusEnum.Offline).length;

  const unreadAll = friendRequestCount + unreadMessageCount + unreadNotificationCount + gameInvites.length;

  const panelContent = (
    <>
      <SocialPanelHeader title={t.title} onlineCount={onlineCount} onlineLabel={t.online} showClose={aside.open} onClose={aside.closeMobile} />

      <div className="px-2">
        <SocialTabs
          value={activeTab}
          onChange={(tab) => {
            setActiveTab(tab);
            setSearchQuery("");
          }}
          labels={{
            friends: t.tabs.friends,
            notifications: t.tabs.notifications,
          }}
          badges={{
            notifications: unreadAll > 0 ? unreadAll : undefined,
          }}
        />
      </div>

      {activeTab === SocialTabId.Friends && (
        <div className="px-2 pt-2">
          <GTextField
            id="social-search"
            value={searchQuery}
            placeholder={t.searchPlaceholder}
            startIcon={<GIcon icon={Search} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      <SocialPanelContent
        router={router}
        activeTab={activeTab}
        friends={friends}
        gameInvites={gameInvites}
        requests={requests}
        notifications={notifications}
        loading={loading}
        searchQuery={searchQuery}
        closeMobile={aside.closeMobile}
        acceptRequest={acceptRequest}
        declineRequest={declineRequest}
        t={t}
      />
    </>
  );

  return (
    <>
      {!aside.collapsed && (
        <aside className="hidden xl:flex xl:h-full xl:w-80 xl:shrink-0 xl:flex-col xl:border-s xl:border-border xl:bg-bg-sidebar">
          {panelContent}
        </aside>
      )}

      <GModal open={aside.open} onClose={aside.closeMobile} side="end" ariaLabel={t.friendsAndInvites} className="hidden md:block xl:hidden">
        {panelContent}
      </GModal>

      <GModal open={aside.open} onClose={aside.closeMobile} side="bottom" ariaLabel={t.friendsAndInvites} className="md:hidden">
        {panelContent}
      </GModal>
    </>
  );
}

export { SocialPanel };
