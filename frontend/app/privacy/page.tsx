"use client";

import Link from "next/link";
import { FileText, Shield } from "lucide-react";

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
import { en, type TPrivacyTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

function PrivacyPolicyPage() {
  const t = useTranslation({ en, ar, fr }) as TPrivacyTranslation;

  return (
    <div className="min-h-screen bg-bg">
      <div className="flex items-center justify-between gap-2 p-4 lg:p-8">
        <LangTheme />
        <GButton variant={ButtonVariantEnum.Secondary}>
          <Link href="/login">{t.backToHome}</Link>
        </GButton>
      </div>
      <GPage className="pt-0">
        <PageHeader icon={Shield} title={t.title} subtitle={t.updated} />
        <GCard padding={SizeEnum.lg} className="space-y-8">
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
          <Link href="/terms" className="inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-primary">
            <GIcon icon={FileText} size={SizeEnum.sm} />
            <span>{t.termsLink}</span>
          </Link>
        </footer>
      </GPage>
    </div>
  );
}

export default PrivacyPolicyPage;
