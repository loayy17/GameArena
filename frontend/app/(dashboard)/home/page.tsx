"use client";

import Link from "next/link";
import { ArrowRight, Frown, Gamepad2, Handshake, MessageSquare, Trophy, UserRoundPlus } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { useMatchHistory } from "@/hooks/useMatchHistory";

import { GPage } from "@/component/common/GPage";
import { GIcon } from "@/component/common/GIcon";
import { GameCard } from "@/component/games/common/GameCard";
import { RecentHistorySection } from "@/component/history/RecentHistorySection";

import { GamesList, translateGameInfo } from "@/domain/constant/games";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type THomeTranslation } from "./i18n/en.i18n";

function Home() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar, fr }) as THomeTranslation;
  const gt = useGameTranslation();
  const { friendRequestCount, unreadMessageCount } = useDashboardData();
  const { summary, loading: historyLoading } = useMatchHistory();

  const stats = [
    { label: t.record.wins, value: historyLoading ? "–" : summary.wins, icon: Trophy, tile: "bg-success/10 text-success", href: "/history" },
    { label: t.record.losses, value: historyLoading ? "–" : summary.losses, icon: Frown, tile: "bg-danger/10 text-danger", href: "/history" },
    { label: t.record.draws, value: historyLoading ? "–" : summary.draws, icon: Handshake, tile: "bg-warning/10 text-warning", href: "/history" },
    { label: t.unreadMessages, value: unreadMessageCount, icon: MessageSquare, tile: "bg-secondary/10 text-secondary", href: "/messages" },
    { label: t.friendRequests, value: friendRequestCount, icon: UserRoundPlus, tile: "bg-primary/10 text-primary", href: "/friends?tab=requests" },
  ];

  return (
    <GPage size={SizeEnum.xl}>
      <section className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">{t.welcome(user?.firstName || "")}</h1>
        <p className="mt-1.5 text-sm text-text-secondary">{t.welcomeDesc}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="flex items-center gap-3 rounded-xl border border-border/40 bg-bg-card px-4 py-3 transition-all hover:bg-bg-card-hover hover:border-border/60 hover:shadow-sm">
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${stat.tile}`}>
                <GIcon icon={stat.icon} size={SizeEnum.md} />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold leading-tight text-text">{stat.value}</p>
                <p className="truncate text-xs text-text-muted">{stat.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary-muted">
              <GIcon icon={Gamepad2} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
            </div>
            <h2 className="text-xl font-bold text-text">{t.gamesTitle}</h2>
          </div>
          <Link
            href="/games"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-hover">
            {t.viewAllGames}
            <GIcon icon={ArrowRight} size={SizeEnum.xs} color={AccentColorEnum.Primary} flip />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
      />
    </GPage>
  );
}

export default Home;
