"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useNotificationList } from "@/hooks/useNotificationList";
import { useAside } from "@/hooks/useAside";
import { en } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { fr } from "@/component/i18n/SocialPanel/fr.i18n";
import { GSearchField } from "@/component/common/GSearchField";
import { GAside } from "@/component/common/GAside";
import { GModal } from "@/component/common/GModal";

import { SocialPanelHeader } from "./SocialPanelHeader";
import { SocialTabId, SocialTabs } from "./SocialTabs";
import { SocialPanelContent } from "./SocialPanelContent";

import type { TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import type { ISocialPanelProps } from "./def/SocialPanel";

function SocialPanel({ aside: asideProp }: ISocialPanelProps) {
  const router = useRouter();
  const t = useTranslation<TSocialPanelTranslation>({ en, ar, fr });
  const {
    gameInvites,
    notifications,
    friends,
    requests,
    loading,
    acceptRequest,
    declineRequest,
  } = useDashboardData();
  const asideDefault = useAside();
  const aside = asideProp ?? asideDefault;

  const [activeTab, setActiveTab] = useState<SocialTabId>(SocialTabId.Friends);
  const [searchQuery, setSearchQuery] = useState("");

  const onlineCount = friends.filter((f) => f.status !== UserStatusEnum.Offline).length;
  const { unreadCount: unreadAll } = useNotificationList("all");

  const panelContent = (
    <>
      <SocialPanelHeader title={t.title} onlineCount={onlineCount} onlineLabel={t.online} showClose={aside.open} onClose={aside.closeMobile} />

      <div className="px-3">
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
        <div className="px-3 pt-3">
          <GSearchField
            id="social-search"
            value={searchQuery}
            placeholder={t.searchPlaceholder}
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
        <GAside side="end" label={t.friendsAndInvites} className="hidden border-border/60 xl:flex xl:h-full xl:w-80">
          {panelContent}
        </GAside>
      )}

      <GModal
        className="hidden md:block xl:hidden"
        open={aside.open}
        onClose={aside.closeMobile}
        side="end"
        panelClassName="w-80"
        ariaLabel={t.friendsAndInvites}>
        {panelContent}
      </GModal>

      <GModal className="block md:hidden" open={aside.open} onClose={aside.closeMobile} side="bottom" ariaLabel={t.friendsAndInvites}>
        {panelContent}
      </GModal>
    </>
  );
}

export { SocialPanel };
