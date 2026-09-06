"use client";

import Link from "next/link";
import { FileText, Scale } from "lucide-react";

import { useTranslation } from "@/hooks/useSetting";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import { GPublicPageShell } from "@/component/common/GPublicPageShell";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GArticleList, GArticleSection } from "@/component/common/GArticle";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { en } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

import type { TTermsTranslation } from "./i18n/en.i18n";

function TermsOfServicePage() {
  const t = useTranslation<TTermsTranslation>({ en, ar, fr });

  return (
    <GPublicPageShell>
      <GPageHeader icon={Scale} title={t.title} subtitle={t.updated} />
      <GCard className="space-y-8 p-6">
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
        <Link href="/privacy" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary">
          <GIcon icon={FileText} size={SizeEnum.sm} />
          <span>{t.privacyLink}</span>
        </Link>
      </footer>
    </GPublicPageShell>
  );
}

export default TermsOfServicePage;
