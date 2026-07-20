"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { ArrowRight, Gamepad2, MessageSquare, Users, Trophy, Zap, Sparkles } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { ar } from "./i18n/ar.i18n";
import { en, type THomeTranslation } from "./i18n/en.i18n";
import { GamesList } from "@/domain/constant/games";
import { RecentHistorySection } from "@/component/history/RecentHistorySection";
import { GPage } from "@/component/common/GPage";
import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GBadge } from "@/component/common/GBadge";
import { GameCard } from "@/component/games/common/GameCard";
import { useRouter } from "next/navigation";
import clsx from "clsx";

function Home() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar }) as THomeTranslation;
  const { friendRequestCount, unreadMessageCount } = useDashboardNotifications();
  const router = useRouter();

  const handleGameSelect = (path: string) => {
    router.push(`/games/${path}`);
  };

  const stats = [
    { label: t.stats.gamesAvailable, value: GamesList.length, icon: Gamepad2, gradient: "bg-primary", href: "/games" },
    { label: t.stats.unreadMessages, value: unreadMessageCount, icon: MessageSquare, gradient: "bg-success", href: "/messages" },
    { label: t.stats.friendRequests, value: friendRequestCount, icon: Users, gradient: "bg-warning", href: "/friends?tab=requests" },
  ];

  const features = [
    { icon: Zap, title: t.features.instantPlay, desc: t.features.instantPlayDesc },
    { icon: Users, title: t.features.playWithFriends, desc: t.features.playWithFriendsDesc },
    { icon: Trophy, title: t.features.rankedMatches, desc: t.features.rankedMatchesDesc },
    { icon: Sparkles, title: t.features.seasonalEvents, desc: t.features.seasonalEventsDesc },
  ];

  return (
    <GPage width="xl" className="py-6 sm:py-8 lg:py-10">
      {/* Hero Section */}
      <section className="mb-10 lg:mb-14 animate-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <GIcon icon={Gamepad2} size="lg" tile tileSize="lg" tileGradient="bg-primary" className="text-on-primary animate-float" />
            <div className="min-w-0">
              <GBadge variant="primary" className="mb-2 text-xs">{t.features.badge}</GBadge>
              <p className="text-sm font-medium text-primary truncate">{t.welcome(user?.firstName || "")}</p>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">{t.brand}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:ms-auto">
            <Link href="/games">
              <GButton size="lg" leftIcon={<GIcon icon={Gamepad2} size="md" color="inherit" />}>
                {t.playNow}
              </GButton>
            </Link>
            <Link href="/history">
              <GButton variant="outline" size="lg" leftIcon={<GIcon icon={Trophy} size="md" color="inherit" />}>
                {t.viewStats}
              </GButton>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {stats.map(({ label, value, icon: Icon, gradient, href }) => (
<Link key={label} href={href} className="group">
            <GCard variant="interactive" className="flex items-center gap-4 p-4 group-hover:-translate-y-1 transition-all duration-300">
              <GIcon icon={Icon} size="md" tile tileSize="md" tileGradient={gradient} className="group-hover:scale-110 transition-transform duration-300" />
              <div className="min-w-0 flex-1">
                <p className="text-2xl sm:text-3xl font-black text-primary">{value}</p>
                <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-text-secondary">{label}</p>
              </div>
                <GIcon icon={ArrowRight} size="sm" color="muted" className="group-hover:text-primary group-hover:translate-x-1 rtl:-translate-x-1 transition-all duration-200" />
              </GCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-10 lg:mb-14 animate-in" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <GBadge variant="secondary" className="mb-2 text-xs">{t.features.badge}</GBadge>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">{t.features.title}</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature) => (
            <GCard key={feature.title} variant="glass" padding="lg" className="group text-center transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-glow">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <GIcon icon={feature.icon} size="lg" color="primary" />
              </div>
              <h3 className="text-lg font-bold text-text mb-1">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.desc}</p>
            </GCard>
          ))}
        </div>
      </section>

      {/* Recent History */}
      <RecentHistorySection
        title={t.recentHistory.title}
        viewAll={t.recentHistory.viewAll}
        emptyTitle={t.recentHistory.emptyTitle}
        emptyDescription={t.recentHistory.emptyDescription}
      />

      {/* Games Grid */}
      <section className="mt-8 lg:mt-12 animate-in" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <GBadge variant="primary" className="mb-2 text-xs">{t.enterArena}</GBadge>
            <h2 className="text-2xl sm:text-3xl font-bold text-text">Available Games</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {GamesList.map((game) => (
            <GameCard
              key={game.type}
              name={t.games[game.name as keyof typeof t.games]}
              desc={t.games[game.description as keyof typeof t.games]}
              icon={game.icon}
              gradientClass={game.gradientClass}
              animation={game.animation}
              onClick={() => handleGameSelect(game.path)}
              playLabel={t.playNow}
              page
            />
          ))}
        </div>
      </section>
    </GPage>
  );
}

export default Home;