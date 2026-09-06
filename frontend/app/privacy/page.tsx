"use client";

import Link from "next/link";
import { FileText, Shield } from "lucide-react";

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

import type { TPrivacyTranslation } from "./i18n/en.i18n";

function PrivacyPolicyPage() {
  const t = useTranslation<TPrivacyTranslation>({ en, ar, fr });

  return (
    <GPublicPageShell>
      <GPageHeader icon={Shield} title={t.title} subtitle={t.updated} />
      <GCard className="space-y-8 p-6">
        <p className="leading-relaxed text-text-secondary">{t.intro}</p>
        <GArticleSection title={t.dataCollectedTitle}>
          <GArticleList items={t.dataCollected} />
        </GArticleSection>
        <GArticleSection title={t.dataUseTitle}>
          <GArticleList items={t.dataUse} />
        </GArticleSection>
        <GArticleSection title={t.cookiesTitle}>
          <p className="leading-relaxed text-text-secondary">{t.cookies}</p>
        </GArticleSection>
        <GArticleSection title={t.sharingTitle}>
          <p className="leading-relaxed text-text-secondary">{t.sharing}</p>
        </GArticleSection>
        <GArticleSection title={t.retentionTitle}>
          <p className="leading-relaxed text-text-secondary">{t.retention}</p>
        </GArticleSection>
        <GArticleSection title={t.rightsTitle}>
          <GArticleList items={t.rights} />
        </GArticleSection>
        <GArticleSection title={t.securityTitle}>
          <p className="leading-relaxed text-text-secondary">{t.security}</p>
        </GArticleSection>
        <GArticleSection title={t.contactTitle}>
          <p className="leading-relaxed text-text-secondary">{t.contact}</p>
        </GArticleSection>
      </GCard>
      <footer className="flex flex-wrap gap-4 pt-6">
        <Link href="/terms" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary">
          <GIcon icon={FileText} size={SizeEnum.sm} />
          <span>{t.termsLink}</span>
        </Link>
      </footer>
    </GPublicPageShell>
  );
}

export default PrivacyPolicyPage;
