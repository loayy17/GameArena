"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Search, Send, ShieldBan, UserCheck, Users } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type TFriendsTranslation } from "./i18n/en.i18n";

import { GTabs } from "@/component/common/GTabs";
import { GPage } from "@/component/common/GPage";
import { PageHeader } from "@/component/common/PageHeader";
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
import type { IGTabItem } from "@/component/common/def/GTabs";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

function FriendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation({ en, ar, fr }) as TFriendsTranslation;
  const activeTab = (searchParams.get("tab") as FriendsTabEnum) ?? FriendsTabEnum.Friends;

  const {
    friends,
    requests,
    sentRequests,
    blockedUsers,
    friendsLoading,
    requestsLoading,
    blockedLoading,
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
      },
      { id: FriendsTabEnum.Sent, label: t.sentRequests, icon: <GIcon icon={Send} size={SizeEnum.sm} />, badge: sentRequestCount || undefined },
      {
        id: FriendsTabEnum.Blocked,
        label: t.blockedUsers,
        icon: <GIcon icon={ShieldBan} size={SizeEnum.sm} />,
        badge: blockedCount || undefined,
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
      <PageHeader
        icon={Users}
        title={t.friends}
        subtitle={t.subtitle}
        badge={
          <GBadge>
            <GIcon icon={Gamepad2} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
            {t.community}
          </GBadge>
        }
      />

      <GTabs tabs={tabs} value={activeTab} onChange={changeTab} fullWidth responsive />

      <div className="pt-1">
        <GAsync loading={tabLoading} spinnerSize={SizeEnum.lg} className="py-10">
          {renderTab()}
        </GAsync>
      </div>
    </GPage>
  );
}

export default FriendsPage;
