"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react";
import { LangTheme } from "@/component/LangTheme/LangTheme";
import { BrandText } from "@/component/common/BrandText";
import { GIcon } from "@/component/common/GIcon";
import { LegalLinks } from "@/component/legal/LegalLinks";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "@/component/legal/i18n/ar.i18n";
import { en, type TLegalTranslation } from "@/component/legal/i18n/en.i18n";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

function LegalLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslation({ en, ar }) as TLegalTranslation;

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text">
      <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-border bg-bg-sidebar">
        <Link href="/home" className="flex items-center gap-2 min-w-0">
          <GIcon icon={Hexagon} size={SizeEnum.md} color={AccentColorEnum.Primary} />
          <span className="font-bold truncate">
            <BrandText name={t.brand} />
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/home" className="hidden sm:inline text-sm text-text-secondary hover:text-primary">
            {t.backHome}
          </Link>
          <LangTheme collapsed={false} className="flex gap-2 w-auto flex-none" />
        </div>
      </header>
      <main className="flex-1 overflow-y-auto custom-scrollbar">{children}</main>
      <footer className="border-t border-border px-4 py-4">
        <LegalLinks />
      </footer>
    </div>
  );
}

export default LegalLayout;
