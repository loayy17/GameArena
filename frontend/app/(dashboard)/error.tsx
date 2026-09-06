"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { useTranslation } from "@/hooks/useSetting";
import { en } from "@/app/i18n/en.i18n";
import { ar } from "@/app/i18n/ar.i18n";
import { fr } from "@/app/i18n/fr.i18n";

import type { TAppTranslation } from "@/app/i18n/en.i18n";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslation<TAppTranslation>({ en, ar, fr });

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-danger-muted">
        <GIcon icon={AlertTriangle} size={SizeEnum.lg} color={AccentColorEnum.Danger} />
      </div>
      <h2 className="text-lg font-bold text-text">{t.error.title}</h2>
      <p className="max-w-sm text-sm text-text-secondary">{error.message || t.error.fallback}</p>
      <GButton onClick={() => reset()} startIcon={<GIcon icon={RotateCcw} size={SizeEnum.sm} />}>
        {t.error.retry}
      </GButton>
    </div>
  );
}
