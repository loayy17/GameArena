"use client";

import { Users, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useMemo, useState } from "react";

import { GameInvitesList } from "./GameInvitesList";
import { GInputSearch } from "@/component/common/GInputSearch";
import { FriendsList } from "./FriendsList";
import { GTabs } from "@/component/common/GTabs";
import type { GTabItem } from "@/component/common/def/GTabs";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useFriendList } from "@/hooks/useFriends";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { GAside, useAsideCtx } from "../common/GAside";
import { GTile } from "../common/GTile";
import { GStatusDot } from "../common/GStatusDot";
import { GSpinner } from "../common/GSpinner";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { GButton } from "../common/GButton";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
type SocialPanelTab = "friends" | "invites";

interface FriendsContextValue {
  friends: IUserSummary[];
  loading: boolean;
  onlineCount: number;
  reload: () => void;
}

const FriendsContext = createContext<FriendsContextValue | null>(null);

function useSharedFriends() {
  const ctx = useContext(FriendsContext);
  if (!ctx) throw new Error("useSharedFriends must be used within FriendsProvider");
  return ctx;
}

function SocialBrand() {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { onlineCount } = useSharedFriends();

  return (
    <div className="min-w-0">
      <p className="font-bold text-text flex items-center gap-2">
        <Users size={16} className="text-text shrink-0" />
        <span className="truncate">{t.title}</span>
      </p>
      <p className="text-xs text-text-muted">
        {onlineCount} {t.online}
      </p>
    </div>
  );
}

function SocialRail() {
  const router = useRouter();
  const { friends } = useSharedFriends();
  const { closeMobile, isCompact } = useAsideCtx();

  const online = friends.filter((f) => f.status === UserStatusEnum.Online).slice(0, 8);

  const goToChat = (id: string) => {
    router.push(`/messages?friend=${id}`);
    if (isCompact) closeMobile();
  };

  if (online.length === 0) {
    return (
      <div className="flex justify-center pt-4">
        <Users size={18} className="text-text-muted" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 py-3">
      {online.map((f) => (
        <GButton
          key={f.id}
          type="button"
          onClick={() => goToChat(f.id)}
          title={`${f.firstName ?? ""} ${f.lastName ?? ""}`.trim() || (f.userName ?? undefined)}
          className="relative shrink-0 rounded-full transition hover:ring-2 hover:ring-primary focus-visible:ring-2 focus-visible:ring-primary outline-none">
          <GTile user={f} size="sm" />
          <GStatusDot status={f.status} className="absolute -bottom-0.5 -end-0.5 ring-2 ring-bg-sidebar" />
        </GButton>
      ))}
    </div>
  );
}

function SocialExpanded() {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites } = useDashboardNotifications();
  const { friends, loading } = useSharedFriends();
  const router = useRouter();
  const { isCompact, closeMobile } = useAsideCtx();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SocialPanelTab>("friends");

  const filteredFriends = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term));
  }, [friends, query]);

  const tabs = useMemo<GTabItem<SocialPanelTab>[]>(
    () => [
      { id: "friends", label: t.tabs.friends, icon: <Users size={16} /> },
      {
        id: "invites",
        label: t.tabs.invites,
        icon: <Bell size={16} />,
        badge: gameInvites.length || undefined,
      },
    ],
    [t, gameInvites.length],
  );

  const goToChat = (id: string) => {
    router.push(`/messages?friend=${id}`);
    if (isCompact) closeMobile();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-bg-sidebar px-4 pt-4">
        <GTabs tabs={tabs} value={activeTab} onChange={setActiveTab} variant="pills" fullWidth />

        {activeTab === "friends" && (
          <div className="pt-4 pb-2">
            <GInputSearch value={query} onChange={setQuery} placeholder={t.searchPlaceholder} />
          </div>
        )}
      </div>

      <div className="flex-1 p-4 space-y-4">
        {activeTab === "invites" ? (
          <GameInvitesList onAfterAccept={() => isCompact && closeMobile()} />
        ) : loading ? (
          <div className="flex justify-center py-10">
            <GSpinner />
          </div>
        ) : (
          <FriendsList friends={filteredFriends} onSelectFriend={goToChat} />
        )}
      </div>
    </div>
  );
}

function SocialBody() {
  const { collapsed, isDesktop } = useAsideCtx();
  return collapsed && isDesktop ? <SocialRail /> : <SocialExpanded />;
}

function SocialPanelInner() {
  const { gameInvites } = useDashboardNotifications();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;

  const collapsedIcon = (
    <span className="relative inline-flex">
      <Users size={20} />
      {gameInvites.length > 0 && <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />}
    </span>
  );

  return (
    <GAside
      side="end"
      widthExpanded="w-80"
      mode="inline"
      ariaLabel={t.friendsAndInvites}
      collapsedIcon={collapsedIcon}
      expandedBrand={<SocialBrand />}>
      <SocialBody />
    </GAside>
  );
}

function SocialPanel() {
  const { friends, loading, onlineCount, reload } = useFriendList();

  const value = useMemo<FriendsContextValue>(
    () => ({ friends, loading, onlineCount, reload }),
    [friends, loading, onlineCount, reload],
  );

  return (
    <FriendsContext.Provider value={value}>
      <SocialPanelInner />
    </FriendsContext.Provider>
  );
}

export { SocialPanel };
