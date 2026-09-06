"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { GSpinner } from "@/component/common/GSpinner";
import { GCard } from "@/component/common/GCard";
import { LangTheme } from "@/component/LangTheme/LangTheme";
import { GBrandText } from "@/component/common/GBrandText";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";

import { en } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

import type { TAuthLayoutTranslation } from "./i18n/en.i18n";
import type { IAuthLayoutProps } from "./def/AuthLayout";

function AuthLayout({ children }: IAuthLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const t = useTranslation<TAuthLayoutTranslation>({ en, ar, fr });

  useEffect(() => {
    if (!loading && user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/home");
    }
  }, [loading, user, router]);

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <GSpinner size={SizeEnum.lg} />
      </div>
    );
  }

  const features = [t.features.instantPlay, t.features.playWithFriends, t.features.rankedMatches, t.features.seasonalEvents];

  return (
    <div className="min-h-screen bg-bg md:flex">
      <section className="relative hidden overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="auth-hero-grid absolute inset-0 opacity-[0.04]" />

        <div className="relative w-full max-w-xl text-center">
          <Image
            src="/arena404_hero.png"
            alt="Arena 404"
            width={120}
            height={120}
            className="mx-auto mb-8 size-32 object-contain drop-shadow-2xl"
            priority
          />

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">
            <GBrandText name={t.brand} />
          </h1>

          <p className="mx-auto mb-8 max-w-sm text-lg leading-relaxed text-text-secondary">{t.heroSubtitle}</p>

          <div className="flex flex-wrap justify-center gap-2">
            {features.map((label) => (
              <span key={label} className="rounded-full border border-primary/20 bg-primary-muted px-3 py-1.5 text-xs font-medium text-primary">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="flex min-h-screen flex-1 flex-col p-4 sm:p-6 lg:p-8">
        <header className="mx-auto flex w-full max-w-xl justify-end">
          <LangTheme />
        </header>

        <main className="flex flex-1 items-center justify-center py-2">
          <GCard variant={CardVariantEnum.Elevated} className="w-full max-w-xl p-8">
            {children}
          </GCard>
        </main>
      </div>
    </div>
  );
}

export default AuthLayout;
