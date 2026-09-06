"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { LangTheme } from "@/component/LangTheme/LangTheme";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { useTranslation } from "@/hooks/useSetting";
import { en } from "@/app/i18n/en.i18n";
import { ar } from "@/app/i18n/ar.i18n";
import { fr } from "@/app/i18n/fr.i18n";

import { GBrandMark } from "./GBrandMark";
import { GPage } from "./GPage";
import { GButton } from "./GButton";
import { GIcon } from "./GIcon";

import type { TAppTranslation } from "@/app/i18n/en.i18n";
import type { IGPublicPageShellProps } from "./def/GPublicPageShell";

function GPublicPageShell({ children, contentClassName }: IGPublicPageShellProps) {
  const router = useRouter();
  const t = useTranslation<TAppTranslation>({ en, ar, fr });

  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-sticky border-b border-border/60 bg-bg-sidebar/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <GBrandMark name="Arena 404" href="/" />
          <LangTheme />
        </div>
      </header>
      <GPage size={SizeEnum.lg} className={contentClassName}>
        <div className="mb-3">
          <GButton variant={ButtonVariantEnum.Subtle} className="rounded-md" onClick={goBack} startIcon={<GIcon icon={ArrowLeft} size={SizeEnum.sm} flip />}>
            {t.back}
          </GButton>
        </div>
        {children}
      </GPage>
    </div>
  );
}

export { GPublicPageShell };
