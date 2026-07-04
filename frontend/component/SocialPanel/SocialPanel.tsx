"use client";

import { Users, X, Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { friendService } from "@/services/def/FriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { GameInvitesList } from "./GameInvitesList";
import { GInputSearch } from "@/component/common/GInputSearch";
import { FriendsList } from "./FriendsList";
import { GTabs } from "@/component/common/GTabs";
import { GTabItem } from "@/component/common/def/GTabs";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { GSpinner } from "@/component/common/GSpinner";
import {
  en,
  type TSocialPanelTranslation,
} from "@/component/i18n/SocialPanel/en.i18n";
import { ar } from "@/component/i18n/SocialPanel/ar.i18n";
import type { IUser } from "@/domain/meta/IUser";
import type { IApiResponse } from "@/domain/meta/IApiResponse";

interface Friend {
  id: string;
  firstName: string | null;
  lastName: string | null;
  userName: string | null;
  status: UserStatusEnum;
}

type SocialPanelTab = "friends" | "invites";

export function SocialPanel() {
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSocialPanelTranslation;
  const { gameInvites } = useDashboardNotifications();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<SocialPanelTab>("friends");

  useEffect(() => {
    let ignore = false;
    friendService
      .getFriends({ name: null, userStatus: UserStatusEnum.All })
      .then((res: IApiResponse<IUser[]>) => {
        if (!ignore) setFriends(res.data || []);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

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

  const onlineCount = friends.filter(
    (f) => f.status !== UserStatusEnum.Offline,
  ).length;

  const panel = (
    <aside className="w-full sm:w-80 lg:w-72 h-dvh-safe bg-bg-sidebar flex flex-col">
      <div className="h-20 flex items-center justify-between px-5 border-b border-border/50">
        <div>
          <p className="font-bold text-text flex items-center gap-2">
            <Users size={18} /> {t.title}
          </p>
          <p className="text-xs text-text-muted">
            {onlineCount} {t.online}
          </p>
        </div>

        <button
          onClick={() => setOpen(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-alt text-text-secondary hover:text-text transition-colors"
        >
          <X size={20} />
        </button>
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
      <div className="hidden lg:flex border-l border-border">{panel}</div>

      {open && (
        <>
          <div
            className="drawer-backdrop lg:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed right-0 top-0 z-50 w-full sm:w-80 lg:hidden h-dvh-safe shadow-2xl animate-fade-in">
            {panel}
          </div>
        </>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fab bottom-6 right-4 lg:hidden"
        >
          <Users size={20} />
        </button>
      )}
    </>
  );
}
