"use client";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { ArrowLeft, Gamepad2, MessagesSquare, UserPlus } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { ar } from "./i18n/ar.i18n";
import { en, type THomeTranslation } from "./i18n/en.i18n";
import { GamesList } from "@/domain/constant/games";
import { RecentHistorySection } from "@/component/history/RecentHistorySection";
import { GPage } from "@/component/common/GPage";
import { GIconTile } from "@/component/common/GIconTile";
import { GCard } from "@/component/common/GCard";
import { GameCard } from "@/component/games/common/GameCard";
import { useRouter } from "next/navigation";

function Home() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar }) as THomeTranslation;
  const { friendRequestCount, unreadMessageCount } = useDashboardNotifications();
  const router = useRouter();
  const handleGameSelect = (path: string) => {
    router.push(`/games/${path}`);
  };
  const stats = [
    {
      label: t.stats.gamesAvailable,
      value: GamesList.length,
      icon: Gamepad2,
      gradient: "bg-primary",
      href: "/games",
    },
    {
      label: t.stats.unreadMessages,
      value: unreadMessageCount,
      icon: MessagesSquare,
      gradient: "bg-success",
      href: "/messages",
    },
    {
      label: t.stats.friendRequests,
      value: friendRequestCount,
      icon: UserPlus,
      gradient: "bg-warning",
      href: "/friends?tab=requests",
    },
  ];

  return (
    <GPage width="md" className="py-8 sm:py-10">
      <div className="flex items-center gap-3">
        <GIconTile gradient="bg-primary" size="md" icon={Gamepad2} className="text-text" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">{t.welcome(user?.firstName || "")}</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">{t.brand}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {stats.map(({ label, value, icon, gradient, href }) => (
          <Link key={label} href={href}>
            <GCard
              variant="interactive"
              className="flex items-center gap-4 p-4 transition-all hover:-translate-y-1
        ">
              <GIconTile gradient={gradient} size="md" icon={icon} className="text-text" />
              <div className="min-w-0 flex-1">
                <p className="text-xl font-black">{value}</p>
                <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
              </div>
              <GIcon icon={ArrowLeft} size="sm" color="inherit" />
            </GCard>
          </Link>
        ))}
      </div>

      <RecentHistorySection
        title={t.recentHistory.title}
        viewAll={t.recentHistory.viewAll}
        emptyTitle={t.recentHistory.emptyTitle}
        emptyDescription={t.recentHistory.emptyDescription}
      />

      <div className="mt-8">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">{t.enterArena}</h2>
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3">
          {GamesList.map((game) => (
            <GameCard
              key={game.type}
              name={t.games[game.name]}
              desc={t.games[game.description]}
              icon={game.icon}
              gradient={game.gradient}
              onClick={() => handleGameSelect(game.path)}
              playLabel={t.playNow}
            />
          ))}
        </div>
      </div>
    </GPage>
  );
}
export default Home;
