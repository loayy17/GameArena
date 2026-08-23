"use client";

import Link from "next/link";
import { FileText, Scale } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { GCard } from "@/component/common/GCard";
import { GPage } from "@/component/common/GPage";
import { PageHeader } from "@/component/common/PageHeader";
import { GArticleSection, GArticleList } from "@/component/common/GArticle";
import { LangTheme } from "@/component/LangTheme/LangTheme";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { en, type TTermsTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

function TermsOfServicePage() {
  const t = useTranslation({ en, ar, fr }) as TTermsTranslation;

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex items-center justify-between gap-2 p-4 lg:p-8">
        <LangTheme />
        <GButton variant={ButtonVariantEnum.Secondary}>
          <Link href="/login">{t.backToHome}</Link>
        </GButton>
      </div>
      <GPage className="pt-0">
        <PageHeader icon={Scale} title={t.title} subtitle={t.updated} />
        <GCard padding={SizeEnum.lg} className="space-y-8">
          <p className="leading-relaxed text-text-secondary">{t.intro}</p>
          <GArticleSection title={t.accountTitle}>
            <GArticleList items={t.account} />
          </GArticleSection>
          <GArticleSection title={t.acceptableUseTitle}>
            <GArticleList items={t.acceptableUse} />
          </GArticleSection>
          <GArticleSection title={t.fairPlayTitle}>
            <p className="leading-relaxed text-text-secondary">{t.fairPlay}</p>
          </GArticleSection>
          <GArticleSection title={t.userContentTitle}>
            <p className="leading-relaxed text-text-secondary">{t.userContent}</p>
          </GArticleSection>
          <GArticleSection title={t.terminationTitle}>
            <p className="leading-relaxed text-text-secondary">{t.termination}</p>
          </GArticleSection>
          <GArticleSection title={t.liabilityTitle}>
            <p className="leading-relaxed text-text-secondary">{t.liability}</p>
          </GArticleSection>
          <GArticleSection title={t.changesTitle}>
            <p className="leading-relaxed text-text-secondary">{t.changes}</p>
          </GArticleSection>
          <GArticleSection title={t.contactTitle}>
            <p className="leading-relaxed text-text-secondary">{t.contact}</p>
          </GArticleSection>
        </GCard>
        <footer className="flex flex-wrap gap-4 pt-6">
          <Link href="/privacy" className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-primary">
            <GIcon icon={FileText} size={SizeEnum.sm} />
            <span>{t.privacyLink}</span>
          </Link>
        </footer>
      </GPage>
    </div>
  );
}

export default TermsOfServicePage;
