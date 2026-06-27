"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, Search, UserCheck, Users } from "lucide-react";
import { useConnection } from "@/Hooks/useConnection";
import { useTranslation } from "@/Hooks/useTranslation";
import { ar } from "./i18n/ar.i18n";
import { en, type TFriendsTranslation } from "./i18n/en.i18n";
import { TTabs } from "@/component/common/TTabs";
import { FriendsTab } from "@/component/friend/FriendsTab";
import { RequestsTab } from "@/component/friend/RequestsTab";
import { SearchTab } from "@/component/friend/SearchTab";
import type { TabItem } from "@/component/common/def/TTabs";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

type TFriendsTab = "friends" | "requests" | "search";

function FriendsPage() {
  const router = useRouter();
  const { connection: gameHub } = useConnection("gameHub");
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const [activeTab, setActiveTab] = useState<TFriendsTab>("friends");

  const tabs = useMemo<TabItem[]>(
    () => [
      { id: "friends", label: t.friends, icon: <Users className="h-4 w-4" /> },
      {
        id: "requests",
        label: t.requests,
        icon: <UserCheck className="h-4 w-4" />,
      },
      { id: "search", label: t.search, icon: <Search className="h-4 w-4" /> },
    ],
    [t.friends, t.requests, t.search],
  );

  const handleInvite = async (friendId: string) => {
    if (!gameHub) return;

    try {
      // Corrected spelling from TicTacTao to TicTacToe
      await gameHub.invoke("InviteFriend", friendId, GamesKindEnum.TicTacToe);
    } catch (error) {
      console.error("Invite failed", error);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-bg custom-scrollbar px-4 py-6 sm:px-6 transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 animate-fade-in">
        {/* Profile / Context Header */}
        <header className="rounded-2xl border border-border/60 bg-surface-alt/40 px-5 py-5 sm:px-6 backdrop-blur-md shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between text-start">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary transition-all">
                <Gamepad2 className="h-3.5 w-3.5" />
                Community
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-text">
                {t.friends}
              </h1>
              <p className="max-w-2xl text-sm text-text-secondary font-medium">
                Find friends, review incoming requests, and search for new
                players without leaving the page.
              </p>
            </div>
          </div>
        </header>

        {/* Dynamic Navigational Tab Deck Container */}
        <section className="rounded-2xl border border-border/60 bg-surface-alt/20 p-3 shadow-md backdrop-blur-sm sm:p-4">
          <TTabs
            tabs={tabs}
            value={activeTab}
            onChange={(tab) => setActiveTab(tab as TFriendsTab)}
          />

          <div className="pt-5 text-start animate-fade-in">
            {activeTab === "friends" && (
              <FriendsTab
                onMessage={(id) => router.push(`/messages?friend=${id}`)}
                onInvite={handleInvite}
                onNavigateToSearch={() => setActiveTab("search")}
              />
            )}

            {activeTab === "requests" && <RequestsTab />}

            {activeTab === "search" && <SearchTab />}
          </div>
        </section>
      </div>
    </div>
  );
}

export default FriendsPage;
