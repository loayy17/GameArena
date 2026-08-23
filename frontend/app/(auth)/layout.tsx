"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { GSpinner } from "@/component/common/GSpinner";
import { GCard } from "@/component/common/GCard";
import { LangTheme } from "@/component/LangTheme/LangTheme";
import { BrandText } from "@/component/common/BrandText";

import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";

import { en, type TAuthLayoutTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

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
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <GSpinner size={SizeEnum.lg} />
      </div>
    );
  }

  const features = [
    [t.features.instantPlay, "bg-primary/10 text-primary border-primary/20"],
    [t.features.playWithFriends, "bg-secondary/10 text-secondary border-secondary/20"],
    [t.features.rankedMatches, "bg-accent/10 text-accent border-accent/20"],
    [t.features.seasonalEvents, "bg-success/10 text-success border-success/20"],
  ];

  return (
    <div className="min-h-screen bg-bg md:flex">
      <section className="relative hidden overflow-hidden lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="auth-hero-grid absolute inset-0 opacity-[0.04]" />
        <div className="absolute left-1/2 top-1/4 size-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 size-64 rounded-full bg-secondary/8 blur-[100px]" />

        <div className="relative w-full max-w-md text-center">
          <Image
            src="/arena404_hero.png"
            alt="404 Arena"
            width={120}
            height={120}
            className="mx-auto mb-8 size-32 object-contain drop-shadow-2xl"
            priority
          />

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-text sm:text-5xl">
            <BrandText name={t.brand} />
          </h1>

          <p className="mx-auto mb-8 max-w-sm text-lg leading-relaxed text-text-secondary">{t.heroSubtitle}</p>

          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {features.map(([label, style]) => (
              <span key={label} className={`rounded-full border px-3 py-1.5 text-xs font-medium ${style}`}>
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="flex min-h-screen flex-1 flex-col p-4 lg:p-8">
        <header className="max-w-xl mx-auto w-full">
          <LangTheme />
        </header>

        <main className="flex flex-1 items-center py-2">
          <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.xl} className="w-full max-w-xl mx-auto">
            {children}
          </GCard>
        </main>
      </div>
    </div>
  );
}

export default AuthLayout;
