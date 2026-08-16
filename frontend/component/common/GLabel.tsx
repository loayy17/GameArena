"use client";

import clsx from "clsx";

import { ar } from "@/component/i18n/GLabel/ar.i18n";
import { fr } from "@/component/i18n/GLabel/fr.i18n";
import { en, type GLabelTranslation } from "@/component/i18n/GLabel/en.i18n";
import { useTranslation } from "@/hooks/useSetting";

import type { IGLabelProps } from "./def/GLabel";

function GLabel({ required, className, children, ...props }: IGLabelProps) {
  const t = useTranslation({ en, ar, fr }) as GLabelTranslation;

  return (
    <label className={clsx("block text-sm font-medium text-text-secondary", className)} {...props}>
      {children}
      {required && (
        <span className="text-danger ms-0.5" aria-label={t.required}>
          *
        </span>
      )}
    </label>
  );
}

export { GLabel };
