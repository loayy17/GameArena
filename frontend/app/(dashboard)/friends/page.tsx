"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2, Search, UserCheck, Users } from "lucide-react";

import { useConnections } from "@/app/providers/ConnectionProvider";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TFriendsTranslation } from "./i18n/en.i18n";

import { GTabs } from "@/component/common/GTabs";
import { FriendsTab } from "@/component/friend/FriendsTab";
import { RequestsTab } from "@/component/friend/RequestsTab";
import { SearchTab } from "@/component/friend/SearchTab";

import type { GTabItem } from "@/component/common/def/GTabs";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GCard } from "@/component/common/GCard";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GPage } from "@/component/common/GPage";

type TFriendsTab = "friends" | "requests" | "search";

const DEFAULT_TAB: TFriendsTab = "friends";

function FriendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { gameConnection: gameHub } = useConnections();
  const t = useTranslation({ en, ar }) as TFriendsTranslation;

  const activeTab = (searchParams.get("tab") as TFriendsTab) ?? DEFAULT_TAB;

  const tabs = useMemo<GTabItem<TFriendsTab>[]>(
    () => [
      {
        id: "friends",
        label: t.friends,
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: "requests",
        label: t.requests,
        icon: <UserCheck className="h-4 w-4" />,
      },
      {
        id: "search",
        label: t.search,
        icon: <Search className="h-4 w-4" />,
      },
    ],
    [t],
  );

  const changeTab = (tab: TFriendsTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/friends?${params.toString()}`, {
      scroll: false,
    });
  };

  const handleInvite = async (friendId: string) => {
    if (!gameHub) return;
    try {
      await gameHub.invoke("InviteFriend", friendId, GamesKindEnum.TicTacToe);
    } catch {}
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

      <GCard padding="sm">
        <GTabs tabs={tabs} value={activeTab} onChange={changeTab} variant="pills" fullWidth>
          <div className="pt-5 text-start">
            {activeTab === "friends" && (
              <FriendsTab
                onMessage={(id) => router.push(`/messages?friend=${id}`)}
                onInvite={handleInvite}
                onNavigateToSearch={() => changeTab("search")}
              />
            )}
            {activeTab === "requests" && <RequestsTab />}
            {activeTab === "search" && <SearchTab />}
          </div>
        </GTabs>
      </GCard>
    </GPage>
  );
}

export default FriendsPage;
