"use client";

import { cn } from "@/lib/cn";
import { ar } from "@/component/i18n/GLabel/ar.i18n";
import { fr } from "@/component/i18n/GLabel/fr.i18n";
import { en } from "@/component/i18n/GLabel/en.i18n";
import { useTranslation } from "@/hooks/useSetting";

import { GTooltip } from "./GTooltip";

import type { GLabelTranslation } from "@/component/i18n/GLabel/en.i18n";
import type { IGLabelProps } from "./def/GLabel";

function GLabel({ required, className, children, ...props }: IGLabelProps) {
  const t = useTranslation<GLabelTranslation>({ en, ar, fr });

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
