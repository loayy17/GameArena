"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/providers/AuthProvider";
import { GSpinner } from "@/component/common/GSpinner";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import { Hexagon } from "lucide-react";
import { LangTheme } from "@/component/LangTheme/LangTheme";
import { BrandText } from "@/component/common/BrandText";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TAuthLayoutTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

function AuthLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const t = useTranslation({ en, ar, fr }) as TAuthLayoutTranslation;

  useEffect(() => {
    if (!loading && user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/home");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <GSpinner size={SizeEnum.lg} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-bg">
      <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center p-8 lg:p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 auth-hero-grid" />
        <div className="absolute inset-0 auth-hero-glow opacity-20" />
        <div className="relative max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary text-on-primary mb-8">
            <GIcon icon={Hexagon} size={SizeEnum.lg} color={AccentColorEnum.OnPrimary} />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-text">
            <BrandText name={t.brand} />
          </h1>
          <p className="text-lg text-text-secondary mb-8 max-w-sm mx-auto">{t.heroSubtitle}</p>
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <span className="px-3 py-1.5 rounded-full bg-bg text-text-muted text-xs font-medium">{t.features.instantPlay}</span>
            <span className="px-3 py-1.5 rounded-full bg-bg text-text-muted text-xs font-medium">{t.features.playWithFriends}</span>
            <span className="px-3 py-1.5 rounded-full bg-bg text-text-muted text-xs font-medium">{t.features.rankedMatches}</span>
            <span className="px-3 py-1.5 rounded-full bg-bg text-text-muted text-xs font-medium">{t.features.seasonalEvents}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen p-4 lg:p-8">
        <div className="flex justify-end">
          <LangTheme collapsed={false} className="flex gap-2" />
        </div>
        <main className="flex flex-1 items-center justify-center">
          <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.xl} className="w-full max-w-xl">
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
