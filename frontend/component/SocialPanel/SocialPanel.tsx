"use client";

import { Users, X, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import clsx from "clsx";

import { GameInvitesList } from "./GameInvitesList";
import { GInputSearch } from "@/component/common/GInputSearch";
import { FriendsList } from "./FriendsList";
import { GTabs } from "@/component/common/GTabs";
import { GTabItem } from "@/component/common/def/GTabs";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { useFriendList } from "@/hooks/useFriends";
import {
  en,
  type TSocialPanelTranslation,
} from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import { GButton } from "../common/GButton";
import { GBackdrop } from "../common/GBackdrop";
import { GIcon } from "../common/GIcon";
import { GSpinner } from "../common/GSpinner";

type SocialPanelTab = "friends" | "invites";

export function SocialPanel() {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites } = useDashboardNotifications();
  const { friends, loading, onlineCount } = useFriendList();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SocialPanelTab>("friends");

  const filteredFriends = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return friends;

    return friends.filter((f) =>
      `${f.firstName ?? ""} ${f.lastName ?? ""} ${f.userName ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [friends, query]);

  const tabs = useMemo<GTabItem<SocialPanelTab>[]>(
    () => [
      {
        id: "friends",
        label: t.tabs.friends,
        icon: <Users size={16} />,
      },
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
    setOpen(false);
  };

  const panel = (
    <aside className="w-full sm:w-80 h-dvh-safe bg-bg-sidebar flex flex-col">
      <div className="h-20 flex items-center justify-between px-5 border-b border-border/50">
        <div>
          <p className="font-bold text-text flex items-center gap-2">
            <GIcon icon={Users} size="sm" color="inherit" className="text-text" />
            {t.title}
          </p>
          <p className="text-xs text-text-muted">
            {onlineCount} {t.online}
          </p>
        </div>

        <GButton
          variant="ghost"
          size="icon"
          rounded="full"
          onClick={() => setOpen(false)}
          aria-label="Close panel"
        >
          <X size={20} />
        </GButton>
      </div>

      <div className="px-4 pt-4">
        <GTabs
          tabs={tabs}
          value={activeTab}
          onChange={setActiveTab}
          variant="pills"
          fullWidth
        />
      </div>

      {activeTab === "friends" && (
        <div className="p-4">
          <GInputSearch value={query} onChange={setQuery} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {activeTab === "invites" ? (
          <GameInvitesList onAfterAccept={() => setOpen(false)} />
        ) : loading ? (
          <div className="flex justify-center py-10">
            <GSpinner />
          </div>
        ) : (
          <FriendsList friends={filteredFriends} onSelectFriend={goToChat} />
        )}
      </div>
    </aside>
  );

  return (
    <>
      {open && (
        <>
          <GBackdrop onClick={() => setOpen(false)} />
          <div
            className={clsx(
              "fixed z-50 inset-y-0 end-0 w-full sm:w-80 h-dvh-safe",
            )}
          >
            {panel}
          </div>
        </>
      )}

      {!open && (
        <GButton
          variant="secondary"
          size="icon"
          rounded="full"
          fab
          className="bottom-4 end-4"
          onClick={() => setOpen(true)}
          aria-label="Open social panel"
        >
          <Users size={20} />
        </GButton>
      )}
    </>
  );
}
