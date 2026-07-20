"use client";

import { Users, Bell, UsersRound, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";

import { GameInvitesList } from "./GameInvitesList";
import { FriendsList } from "./FriendsList";
import { GTabs } from "@/component/common/GTabs";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useFriends } from "@/hooks/useFriends";
import { en, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { useAside } from "@/hooks/useAside";
import { GSpinner } from "../common/GSpinner";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { GButton } from "../common/GButton";
import { GAvatar } from "../common/GAvatar";
import type { GTabItem } from "@/component/common/def/GTabs";
import { GTextField } from "../common/GTextField";
import { GBackdrop } from "../common/GBackdrop";
type SocialPanelTab = "friends" | "invites";

function SocialBrand() {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { onlineCount } = useFriends();

  return (
    <div className="min-w-0">
      <p className="font-bold text-text flex items-center gap-2">
        <GIcon icon={Users} size="sm" color="inherit" className="shrink-0" />
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
  const { friends } = useFriends();
  const { closeMobile, isCompact } = useAside();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;

  const online = friends.filter((f) => f.status === UserStatusEnum.Online).slice(0, 8);

  const goToChat = (id: string) => {
    router.push(`/messages?friend=${id}`);
    if (isCompact) closeMobile();
  };

  if (online.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={Users} size="md" color="muted" />}
        title={t.noOnlineTitle}
        description={t.noOnlineDescription}
      />
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
          <GAvatar firstName={f.firstName} lastName={f.lastName} status={f.status} size="sm" shape="circle" />
        </GButton>
      ))}
    </div>
  );
}

function SocialExpanded() {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites } = useDashboardNotifications();
  const { friends, loading } = useFriends();
  const { isCompact, closeMobile } = useAside();

  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SocialPanelTab>("friends");

  const filteredFriends = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return friends;
    return friends.filter((f) => `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`.toLowerCase().includes(term));
  }, [friends, query]);

  const tabs = useMemo<GTabItem<SocialPanelTab>[]>(
    () => [
      { id: "friends", label: t.tabs.friends, icon: <GIcon icon={Users} size="sm" color="inherit" /> },
      {
        id: "invites",
        label: t.tabs.invites,
        icon: <GIcon icon={Bell} size="sm" color="inherit" />,
        badge: gameInvites.length || undefined,
      },
    ],
    [t, gameInvites.length],
  );

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-bg-sidebar px-4 pt-4">
        <GTabs tabs={tabs} value={activeTab} onChange={setActiveTab} variant="pills" fullWidth />

        {activeTab === "friends" && (
          <div className="pt-4 pb-2">
            <GTextField
              id="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              startIcon={<GIcon icon={Search} size="sm" color="muted" />}
            />
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
        ) : filteredFriends.length === 0 ? (
          <GEmpty icon={<GIcon icon={UsersRound} size="xl" color="muted" />} title={t.noFriendsTitle} description={t.noFriendsDescription} />
        ) : (
          <FriendsList friends={filteredFriends} query={query} messageLabel={t.message} activeLabel={t.active} />
        )}
      </div>
    </div>
  );
}

function SocialBody() {
  const { collapsed, isDesktop } = useAside();
  return collapsed && isDesktop ? <SocialRail /> : <SocialExpanded />;
}

function SocialPanel() {
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites } = useDashboardNotifications();
  const aside = useAside(false);
  const { collapsed, open, isDesktop } = aside;

  const isInlineDesktop = isDesktop;
  const isOverlay = !isInlineDesktop;
  const showBackdrop = isOverlay && open;

  const collapsedIcon = (
    <span className="relative inline-flex">
      <GIcon icon={Users} size="md" tile tileSize="md" />
      {gameInvites.length > 0 && <span className="absolute -top-1 -inset-e-1 w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />}
    </span>
  );

  const asideClass = clsx(
    "flex flex-col shrink-0 h-dvh-safe bg-bg-sidebar transition-transform duration-200",
    "border-s border-border",
    isInlineDesktop
      ? collapsed
        ? "w-20"
        : "w-80"
      : [
          "fixed inset-y-0 z-50 end-0",
          open
            ? ["translate-x-0 shadow-2xl", "w-80"]
            : ["ltr:translate-x-full rtl:-translate-x-full", "w-0 overflow-hidden border-0 pointer-events-none"],
        ],
  );

  return (
    <>
      {showBackdrop && <GBackdrop onClick={aside.closeMobile} />}

      <aside
        className={asideClass}
        aria-label={t.friendsAndInvites}
        role={isOverlay ? "dialog" : undefined}
        aria-modal={isOverlay && open ? true : undefined}
        aria-hidden={isOverlay && !open ? true : undefined}>
        <header className="h-20 shrink-0 border-b border-border flex items-center px-4">
          <div className={clsx("flex items-center w-full gap-2", collapsed && isInlineDesktop && "justify-center")}>
            {collapsed && isInlineDesktop ? (
              <GButton variant="ghost" size="icon" onClick={aside.expand} aria-label={`Expand ${t.friendsAndInvites}`}>
                {collapsedIcon}
              </GButton>
            ) : (
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <SocialBrand />
              </div>
            )}

            {isInlineDesktop && !collapsed && (
              <GButton variant="ghost" size="icon" onClick={aside.collapse} className="ms-auto" aria-label={`Collapse ${t.friendsAndInvites}`}>
                <X size={18} />
              </GButton>
            )}

            {isOverlay && open && (
              <GButton variant="ghost" size="icon" onClick={aside.closeMobile} className="ms-auto" aria-label={`Close ${t.friendsAndInvites}`}>
                <X size={20} />
              </GButton>
            )}
          </div>
        </header>

        {(isInlineDesktop || open) && (
          <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <SocialBody />
          </main>
        )}
      </aside>

      {isOverlay && !open && (
        <GButton
          fab
          variant="secondary"
          size="icon"
          rounded="full"
          onClick={aside.openMobile}
          className="bottom-4 end-4"
          aria-label={`Open ${t.friendsAndInvites}`}>
          {collapsedIcon}
        </GButton>
      )}
    </>
  );
}

export { SocialPanel };
