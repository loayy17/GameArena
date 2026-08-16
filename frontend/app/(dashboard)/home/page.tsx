"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { ArrowRight, Gamepad2, MessageSquare, Users, Trophy, Zap, Sparkles, Hexagon } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type THomeTranslation } from "./i18n/en.i18n";
import { GamesList, translateGameInfo } from "@/domain/constant/games";
import { RecentHistorySection } from "@/component/history/RecentHistorySection";
import { GPage } from "@/component/common/GPage";
import { GCard } from "@/component/common/GCard";
import { GameCard } from "@/component/games/common/GameCard";
import { useRouter } from "next/navigation";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import dynamic from "next/dynamic";

const LottiePlayer = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), { ssr: false });

function Home() {
  const { user } = useAuth();
  const t = useTranslation({ en, ar, fr }) as THomeTranslation;
  const gt = useGameTranslation();
  const { friendRequestCount, unreadMessageCount } = useDashboardData();
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
    <GPage size={SizeEnum.xl} className="py-6 sm:py-8 lg:py-10">
      {/* Hero Section */}
      <section className="mb-8 lg:mb-12">
        <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.md} className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <GIcon icon={Hexagon} size={SizeEnum.lg} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text">{t.brand}</h1>
          </div>
          <div className="text-right">
            <strong className="block text-xl sm:text-2xl font-medium text-primary truncate">{t.welcome(user?.firstName || "")}</strong>
            <p className="text-sm text-text-secondary truncate">{t.welcomeDesc}</p>
          </div>
          <LottiePlayer autoplay loop src={"/game.json"} className="w-24 h-24 sm:w-32 sm:h-32" />
        </GCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="group">
              <GCard variant={CardVariantEnum.Interactive} className="flex items-center gap-4 p-4 h-full">
                <GIcon icon={stat.icon} size={SizeEnum.md} tile tileGradient={stat.gradient} />
                <div className="min-w-0 flex-1">
                  <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-text-secondary">{stat.label}</p>
                </div>
                <GIcon icon={ArrowRight} size={SizeEnum.sm} color={AccentColorEnum.Muted} flip />
              </GCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-8 lg:mb-12">
        <h2 className="text-2xl font-bold text-text mb-6">{t.features.title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {features.map((feature) => (
            <GCard key={feature.title} variant={CardVariantEnum.Default} padding={SizeEnum.lg} className="text-center h-full">
              <div className="flex justify-center mb-4">
                <GIcon icon={feature.icon} size={SizeEnum.lg} color={AccentColorEnum.Primary} />
              </div>
              <h3 className="text-lg font-bold text-text mb-1">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.desc}</p>
            </GCard>
          ))}
        </div>
      </section>

      {/* Games Grid */}
      <section>
        <h2 className="text-2xl font-bold text-text mb-6">{t.gamesAvailable}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {GamesList.map((game) => {
            const { name, description } = translateGameInfo(gt, game.type);
            return (
              <GameCard
                key={game.type}
                name={name}
                desc={description}
                animation={game.animation}
                onClick={() => handleGameSelect(game.path)}
                playLabel={t.playNow}
              />
            );
          })}
        </div>
      </section>

      {/* Recent History */}
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
