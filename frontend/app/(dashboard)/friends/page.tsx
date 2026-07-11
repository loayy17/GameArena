"use client";

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Search, Send, ShieldBan, UserCheck, Users } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TFriendsTranslation } from "./i18n/en.i18n";

import { GTabs } from "@/component/common/GTabs";
import { GCard } from "@/component/common/GCard";
import { GSkeleton } from "@/component/common/GSkeleton";
import { GPage } from "@/component/common/GPage";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";

import { FriendsListTab } from "@/component/friend/FriendsListTab";
import { RequestsTab } from "@/component/friend/RequestsTab";
import { SentRequestsTab } from "@/component/friend/SentRequestsTab";
import { BlockedUsersTab } from "@/component/friend/BlockedUsersTab";
import { SearchTab } from "@/component/friend/SearchTab";

import { useFriends } from "@/hooks/useFriends";

import type { GTabItem } from "@/component/common/def/GTabs";

type TFriendsTab = "friends" | "requests" | "sent" | "blocked" | "search";

const DEFAULT_TAB: TFriendsTab = "friends";

function FriendsSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <GCard key={i} padding="md" className="flex items-center mb-3">
          <GSkeleton variant="rect" className="w-16 h-16 mr-2" />
          <div className="flex-1">
            <GSkeleton variant="text" className="w-24 h-4 mb-1" />
            <GSkeleton variant="text" className="w-24 h-4 mb-1" />
          </div>
          <GSkeleton variant="text" className="w-16 h-8 ml-auto" />
        </GCard>
      ))}
    </>
  );
}

function FriendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const activeTab = (searchParams.get("tab") as TFriendsTab) ?? DEFAULT_TAB;

  const {
    friends,
    requests,
    sentRequests,
    blockedUsers,
    friendsLoading,
    requestsLoading,
    blockedLoading,
    removeFriend,
    blockUser,
    unblockUser,
    acceptRequest,
    declineRequest,
    cancelFriendRequest,
  } = useFriends();

  const tabLoading = useMemo(() => {
    switch (activeTab) {
      case "friends": return friendsLoading;
      case "requests": 
      case "sent": return requestsLoading;
      case "blocked": return blockedLoading;
      default: return false;
    }
  }, [activeTab, friendsLoading, requestsLoading, blockedLoading]);

  const tabs = useMemo<GTabItem<TFriendsTab>[]>(() => [
    { id: "friends", label: t.friends, icon: <GIcon icon={Users} size="sm" color="inherit" /> },
    { id: "requests", label: t.requests, icon: <GIcon icon={UserCheck} size="sm" color="inherit" /> },
    { id: "sent", label: t.sentRequests, icon: <GIcon icon={Send} size="sm" color="inherit" /> },
    { id: "blocked", label: t.blockedUsers, icon: <GIcon icon={ShieldBan} size="sm" color="inherit" /> },
    { id: "search", label: t.search, icon: <GIcon icon={Search} size="sm" color="inherit" /> },
  ], [t]);

  const changeTab = useCallback((tab: TFriendsTab) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    router.push(`/friends?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const renderTab = () => {
    switch (activeTab) {
      case "friends":
        return (
          <FriendsListTab
            friends={friends}
            messageLabel={t.message}
            activeLabel={t.message}
            onMessage={(id) => router.push(`/messages?friend=${id}`)}
            onBlock={blockUser}
            onRemove={removeFriend}
            onAddFriend={() => changeTab("search")}
            t={t}
          />
        );

      case "requests":
        return (
          <RequestsTab
            requests={requests}
            onAccept={acceptRequest}
            onDecline={declineRequest}
            t={t}
          />
        );

      case "sent":
        return (
          <SentRequestsTab
            sentRequests={sentRequests}
            onCancel={cancelFriendRequest}
            t={t}
          />
        );

      case "blocked":
        return (
          <BlockedUsersTab
            blockedUsers={blockedUsers}
            onUnblock={unblockUser}
            t={t}
          />
        );

      case "search":
        return <SearchTab />;

      default:
        return null;
    }
  };

  return (
    <GPage width="lg">
      <GCard padding="md">
        <GPageHeader
          badge={
            <GBadge>
              <GIcon icon={Gamepad2} size="xs" color="primary" />
              {t.community}
            </GBadge>
          }
          title={t.friends}
          subtitle={t.subtitle}
        />
      </GCard>

      <GCard padding="sm" className="space-y-4">
        <div className="md:hidden">
          <GTabs tabs={tabs} value={activeTab} onChange={changeTab} direction="V" variant="pills" fullWidth />
        </div>

        <div className="hidden md:block">
          <GTabs tabs={tabs} value={activeTab} onChange={changeTab} variant="pills" fullWidth />
        </div>

        <div className="pt-1 text-start">
          {tabLoading ? <FriendsSkeleton /> : renderTab()}
        </div>
      </GCard>
    </GPage>
  );
}

export default FriendsPage;
