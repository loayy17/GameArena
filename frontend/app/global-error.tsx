"use client";

import { ArrowLeft, AlertTriangle } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { en, type TAppTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { useTranslation } from "@/hooks/useSetting";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const t = useTranslation<TAppTranslation>({ en, ar, fr });
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg">
        <div className="min-h-screen flex items-center justify-center bg-bg">
          <div className="max-w-sm mx-auto text-center p-8 space-y-6 rounded-3xl bg-bg-card/70 shadow-xl backdrop-blur-md border border-border/20">
            <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-danger-muted">
              <GIcon icon={AlertTriangle} size={SizeEnum.xl} color={AccentColorEnum.Danger} />
            </div>
            <h1 className="text-xl font-extrabold text-text tracking-tight">{t.error.title}</h1>
            <p className="text-sm text-text-secondary leading-relaxed">{error.message || t.error.fallback}</p>
            <div className="flex gap-3">
              <GButton onClick={() => reset()} className="flex-1 rounded-xl" startIcon={<GIcon icon={AlertTriangle} size={SizeEnum.sm} />}>
                {t.error.retry}
              </GButton>
              <GButton
                href="/home"
                variant={ButtonVariantEnum.Secondary}
                className="flex-1 rounded-xl"
                startIcon={<GIcon icon={ArrowLeft} size={SizeEnum.md} />}>
                {t.back}
              </GButton>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
