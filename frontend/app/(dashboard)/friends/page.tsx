"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Search, Send, ShieldBan, UserCheck, Users } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { GTabs } from "@/component/common/GTabs";
import { GPage } from "@/component/common/GPage";
import { GAlert } from "@/component/common/GAlert";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GAsync } from "@/component/common/GAsync";
import { FriendsListTab } from "@/component/friend/FriendsListTab";
import { RequestsTab } from "@/component/friend/RequestsTab";
import { SentRequestsTab } from "@/component/friend/SentRequestsTab";
import { BlockedUsersTab } from "@/component/friend/BlockedUsersTab";
import { SearchTab } from "@/component/friend/SearchTab";
import { FriendsTabEnum } from "@/domain/enum/FriendsTabEnum";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en } from "./i18n/en.i18n";

import type { TFriendsTranslation } from "./i18n/en.i18n";
import type { IGTabItem } from "@/component/common/def/GTabs";

function FriendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation<TFriendsTranslation>({ en, ar, fr });
  const rawTab = searchParams.get("tab") as FriendsTabEnum | null;
  const allowedTabs = Object.values(FriendsTabEnum) as string[];
  const activeTab = rawTab && allowedTabs.includes(rawTab) ? rawTab : FriendsTabEnum.Friends;

  const {
    friends,
    requests,
    sentRequests,
    blockedUsers,
    friendsLoading,
    requestsLoading,
    blockedLoading,
    isOffline,
    requestCount,
    sentRequestCount,
    blockedCount,
    removeFriend,
    blockUser,
    unblockUser,
    acceptRequest,
    declineRequest,
    cancelRequest,
  } = useDashboardData();

  const tabLoading = useMemo(() => {
    switch (activeTab) {
      case FriendsTabEnum.Friends:
        return friendsLoading;
      case FriendsTabEnum.Requests:
      case FriendsTabEnum.Sent:
        return requestsLoading;
      case FriendsTabEnum.Blocked:
        return blockedLoading;
      default:
        return false;
    }
  }, [activeTab, friendsLoading, requestsLoading, blockedLoading]);

  const tabs = useMemo<IGTabItem<FriendsTabEnum>[]>(
    () => [
      { id: FriendsTabEnum.Friends, label: t.friends, icon: <GIcon icon={Users} size={SizeEnum.sm} /> },
      {
        id: FriendsTabEnum.Requests,
        label: t.requests,
        icon: <GIcon icon={UserCheck} size={SizeEnum.sm} />,
        badge: requestCount || undefined,
        badgeTone: AccentColorEnum.Warning,
      },
      {
        id: FriendsTabEnum.Sent,
        label: t.sentRequests,
        icon: <GIcon icon={Send} size={SizeEnum.sm} />,
        badge: sentRequestCount || undefined,
        badgeTone: AccentColorEnum.Muted,
      },
      {
        id: FriendsTabEnum.Blocked,
        label: t.blockedUsers,
        icon: <GIcon icon={ShieldBan} size={SizeEnum.sm} />,
        badge: blockedCount || undefined,
        badgeTone: AccentColorEnum.Muted,
      },
      { id: FriendsTabEnum.Search, label: t.search, icon: <GIcon icon={Search} size={SizeEnum.sm} /> },
    ],
    [t, requestCount, sentRequestCount, blockedCount],
  );

  const changeTab = useCallback(
    (tab: FriendsTabEnum) => {
      const params = new URLSearchParams(searchParams);
      params.set("tab", tab);
      router.push(`/friends?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const renderTab = () => {
    switch (activeTab) {
      case FriendsTabEnum.Friends:
        return (
          <FriendsListTab
            friends={friends}
            onMessage={(id) => router.push(`/messages?friend=${id}`)}
            onBlock={blockUser}
            onRemove={removeFriend}
            onAddFriend={() => changeTab(FriendsTabEnum.Search)}
            t={t}
          />
        );

      case FriendsTabEnum.Requests:
        return <RequestsTab requests={requests} onAccept={acceptRequest} onDecline={declineRequest} t={t} />;

      case FriendsTabEnum.Sent:
        return <SentRequestsTab sentRequests={sentRequests} onCancel={cancelRequest} t={t} />;

      case FriendsTabEnum.Blocked:
        return <BlockedUsersTab blockedUsers={blockedUsers} onUnblock={unblockUser} t={t} />;

      case FriendsTabEnum.Search:
        return <SearchTab />;

      default:
        return null;
    }
  };

  return (
    <GPage size={SizeEnum.lg}>
      <GPageHeader
        icon={Users}
        title={t.friends}
        subtitle={t.subtitle}
        className="hidden md:block"
        badge={
          <GBadge>
            <GIcon icon={Gamepad2} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
            {t.community}
          </GBadge>
        }
      />

      <GTabs tabs={tabs} value={activeTab} responsive onChange={changeTab} tabClassName="w-full md:flex-1 md:justify-center" panelId="friends-panel" />

      {isOffline && (
        <GAlert severity={AccentColorEnum.Warning}>
          {t.offlineWarning}
        </GAlert>
      )}

      <div id="friends-panel" className="pt-1" role="tabpanel" aria-label={String(tabs.find((tab) => tab.id === activeTab)?.label ?? "")}>
        <GAsync loading={tabLoading} spinnerSize={SizeEnum.lg} className="py-10">
          {renderTab()}
        </GAsync>
      </div>
    </GPage>
  );
}

export default FriendsPage;
