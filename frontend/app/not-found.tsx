"use client";

import { ArrowLeft, Frown } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { useTranslation } from "@/hooks/useSetting";

import { en } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

import type { TAppTranslation } from "./i18n/en.i18n";

export default function NotFound() {
  const t = useTranslation<TAppTranslation>({ en, ar, fr });

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <GCard variant={CardVariantEnum.Elevated} className="max-w-sm mx-auto text-center p-8 space-y-6">
        <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-primary-muted">
          <GIcon icon={Frown} size={SizeEnum.xl} color={AccentColorEnum.Primary} />
        </div>
        <h1 className="text-4xl font-extrabold text-text tracking-tight">404</h1>
        <p className="text-sm text-text-secondary leading-relaxed">{t.notFound.description}</p>
        <GButton variant={ButtonVariantEnum.Primary} href="/home" className="w-full rounded-xl" startIcon={<GIcon icon={ArrowLeft} size={SizeEnum.md} />}>
          {t.notFound.backHome}
        </GButton>
      </GCard>
    </div>
  );
}
