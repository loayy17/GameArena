"use client";

import { cn } from "@/lib/cn";
import { GTooltip } from "./GTooltip";

import { ar } from "@/component/i18n/GLabel/ar.i18n";
import { fr } from "@/component/i18n/GLabel/fr.i18n";
import { en, type GLabelTranslation } from "@/component/i18n/GLabel/en.i18n";
import { useTranslation } from "@/hooks/useSetting";

import type { IGLabelProps } from "./def/GLabel";

function GLabel({ required, className, children, ...props }: IGLabelProps) {
  const t = useTranslation({ en, ar, fr }) as GLabelTranslation;

  return (
    <label className={cn("block text-sm font-medium text-text-secondary mb-1", className)} {...props}>
      {children}
      {required && (
        <GTooltip content={t.required} side="top">
          <span className="text-accent ms-0.5 cursor-help">*</span>
        </GTooltip>
      )}
    </label>
  );
}

export { GLabel };
