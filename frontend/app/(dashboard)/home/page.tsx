"use client";
import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { Gamepad2, ArrowRight, MessagesSquare, UserPlus } from "lucide-react";
import { ar } from "./i18n/ar.i18n";
import { en, type THomeTranslation } from "./i18n/en.i18n";
import { games, type GameId } from "@/domain/constant/games";
import { RecentHistorySection } from "@/component/history/RecentHistorySection";
import { GPage } from "@/component/common/GPage";
import { GStatCard } from "@/component/common/GStatCard";
import { GIconTile } from "@/component/common/GIconTile";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";

function getGameLabels(t: THomeTranslation, id: GameId) {
  const descKey = `${id}Description` as keyof THomeTranslation["games"];
  return { name: t.games[id], desc: t.games[descKey] };
}

function getGreeting(t: THomeTranslation) {
  const hour = new Date().getHours();
  if (hour < 12) return t.greeting.morning;
  if (hour < 18) return t.greeting.afternoon;
  return t.greeting.evening;
}

function Home() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar }) as THomeTranslation;
  const { friendRequestCount, unreadMessageCount } = useDashboardNotifications();

  const stats = [
    { label: t.stats.gamesAvailable, value: games.length, icon: Gamepad2, iconColor: "primary" as const, href: "/games" },
    { label: t.stats.unreadMessages, value: unreadMessageCount, icon: MessagesSquare, iconColor: "primary" as const, href: "/messages" },
    { label: t.stats.friendRequests, value: friendRequestCount, icon: UserPlus, iconColor: "warning" as const, href: "/friends" },
  ];

  return (
    <GPage width="md" className="py-8 sm:py-10">
      <div className="flex items-center gap-3">
        <GIconTile gradient="brand" size="md">
          <GIcon icon={Gamepad2} size="md" color="inherit" className="text-text" />
        </GIconTile>
        <div className="min-w-0">
          <p className="text-sm font-medium text-primary truncate">
            {getGreeting(t)}
            {user?.firstName ? `, ${user.firstName}` : ""}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">GameArena</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map(({ label, value, icon, iconColor, href }) => {
          const card = <GStatCard label={label} value={value} icon={icon} iconColor={iconColor} />;
          return href ? <Link key={label} href={href}>{card}</Link> : <div key={label}>{card}</div>;
        })}
      </div>

      <RecentHistorySection
        title={t.recentHistory.title}
        viewAll={t.recentHistory.viewAll}
        emptyTitle={t.recentHistory.emptyTitle}
        emptyDescription={t.recentHistory.emptyDescription}
      />

      <div>
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-3">
          {t.enterArena}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {games.map((game) => {
            const Icon = game.icon;
            const { name, desc } = getGameLabels(t, game.id);
            return (
              <Link key={game.id} href={game.path}>
                <GCard variant="interactive" className="flex items-center gap-4">
                  <GIconTile gradient={game.gradient} size="md">
                    <GIcon icon={Icon} size="md" color="inherit" className="text-text" />
                  </GIconTile>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-text">{name}</h3>
                    <p className="text-text-secondary text-sm truncate">{desc}</p>
                  </div>
                  <GIcon icon={ArrowRight} size="md" color={game.color} />
                </GCard>
              </Link>
            );
          })}
        </div>
      </div>
    </GPage>
  );
}
export default Home;
