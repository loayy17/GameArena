"use client";

import Link from "next/link";
import clsx from "clsx";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TLegalTranslation } from "./i18n/en.i18n";
import type { ILegalLinksProps } from "./def/LegalLinks";

function LegalLinks({ collapsed = false, className }: ILegalLinksProps) {
  const t = useTranslation({ en, ar }) as TLegalTranslation;

  return (
    <nav
      aria-label={t.legalNav}
      className={clsx(
        "flex text-xs text-text-muted",
        collapsed ? "flex-col items-center gap-1" : "flex-wrap items-center justify-center gap-x-2 gap-y-1",
        className,
      )}>
      <Link href="/privacy" className="hover:text-primary transition-colors">
        {t.privacy}
      </Link>
      {!collapsed && <span aria-hidden="true">·</span>}
      <Link href="/terms" className="hover:text-primary transition-colors">
        {t.terms}
      </Link>
    </nav>
  );
}

export { LegalLinks };
