"use client";

import Link from "next/link";
import { Frown, Gamepad2, Handshake, MessageSquare, Trophy, UserRoundPlus } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { cn } from "@/lib/cn";
import { GPage } from "@/component/common/GPage";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GSectionHeader } from "@/component/common/GSectionHeader";
import { GameCard } from "@/component/games/common/GameCard";
import { RecentHistorySection } from "@/component/history/RecentHistorySection";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { GamesList, translateGameInfo } from "@/domain/constant/games";
import { focusRing } from "@/domain/constant/style-tokens";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en } from "./i18n/en.i18n";

import type { THomeTranslation } from "./i18n/en.i18n";

function Home() {
  const { user } = useAuth();
  const t = useTranslation<THomeTranslation>({ en, ar, fr });
  const gt = useGameTranslation();
  const { friendRequestCount, unreadMessageCount } = useDashboardData();
  const { matches, summary, loading: historyLoading, error: historyError, reload: reloadHistory } = useMatchHistory();

  const stats = [
    { label: t.record.wins, value: historyLoading ? "–" : summary.wins, icon: Trophy, tile: "bg-success/10 text-success", href: "/history" },
    { label: t.record.losses, value: historyLoading ? "–" : summary.losses, icon: Frown, tile: "bg-danger/10 text-danger", href: "/history" },
    { label: t.record.draws, value: historyLoading ? "–" : summary.draws, icon: Handshake, tile: "bg-warning/10 text-warning", href: "/history" },
    { label: t.unreadMessages, value: unreadMessageCount, icon: MessageSquare, tile: "bg-secondary/10 text-secondary", href: "/messages" },
    { label: t.friendRequests, value: friendRequestCount, icon: UserRoundPlus, tile: "bg-primary/10 text-primary", href: "/friends?tab=requests" },
  ];

  return (
    <GPage size={SizeEnum.xl} className="@container">
      <section className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">{t.welcome(user?.firstName || "")}</h1>
        <p className="mt-1.5 text-sm text-text-secondary">{t.welcomeDesc}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 @lg:grid-cols-3 @4xl:grid-cols-5">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className={cn("rounded-2xl", focusRing)}>
              <GCard variant={CardVariantEnum.Interactive} className="flex items-center gap-3 p-3 sm:p-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.tile}`}>
                  <GIcon icon={stat.icon} size={SizeEnum.md} />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-tight text-text">{stat.value}</p>
                  <p className="text-xs leading-tight text-text-muted">{stat.label}</p>
                </div>
              </GCard>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <GSectionHeader icon={Gamepad2} title={t.gamesTitle} actionHref="/games" actionLabel={t.viewAllGames} className="mb-5" />
        <div className="grid grid-cols-1 gap-3 @xl:grid-cols-2 @4xl:grid-cols-3">
          {GamesList.slice(0, 3).map((game) => {
            const { name, description } = translateGameInfo(gt, game.type);
            return (
              <GameCard
                key={game.type}
                name={name}
                desc={description}
                animation={game.animation}
                playLabel={t.playNow}
                path={`/games/${game.path}`}
                compact
              />
            );
          })}
        </div>
      </section>

      <RecentHistorySection
        title={t.recentHistory.title}
        viewAll={t.recentHistory.viewAll}
        emptyTitle={t.recentHistory.emptyTitle}
        emptyDescription={t.recentHistory.emptyDescription}
        matches={matches}
        loading={historyLoading}
        error={historyError}
        onRetry={reloadHistory}
      />
    </GPage>
  );
}

export default Home;
