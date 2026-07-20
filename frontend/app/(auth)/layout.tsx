"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { GSpinner } from "@/component/common/GSpinner";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import { Hexagon } from "lucide-react";
import { LangTheme } from "@/component/LangTheme";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TAuthLayoutTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";

function AuthLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const t = useTranslation({ en, ar }) as TAuthLayoutTranslation;

  useEffect(() => {
    if (!loading && user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/home");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <GSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-bg">
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center p-8 lg:p-12 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-primary)_0%,transparent_70%)] opacity-20" />
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-primary to-accent text-on-primary shadow-glow mb-8 animate-float">
            <GIcon icon={Hexagon} size="3xl" color="on-primary" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
            Game<span className="text-primary">Arena</span>
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-sm mx-auto">
            {t.heroSubtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">{t.features.instantPlay}</span>
            <span className="px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium border border-secondary/20">
              {t.features.playWithFriends}
            </span>
            <span className="px-4 py-2 rounded-full bg-warning/10 text-warning text-sm font-medium border border-warning/20">{t.features.rankedMatches}</span>
            <span className="px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">{t.features.seasonalEvents}</span>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              {t.stats.activePlayers}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
              {t.stats.matchesPerDay}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen p-4 lg:p-8">
        <div className="flex justify-end">
          <LangTheme collapsed={false} className="flex gap-2" />
        </div>
        <main className="flex flex-1 items-center justify-center">
          <GCard variant="elevated" padding="xl" className="w-full max-w-xl">
            {children}
          </GCard>
        </main>
      </div>
    </div>
  );
}

function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export { AuthLayout };
export default AuthRouteLayout;
