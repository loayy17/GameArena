"use client";

import { ScrollText } from "lucide-react";
import { LegalDocument } from "@/component/legal/LegalDocument";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "@/component/legal/i18n/ar.i18n";
import { en, type TLegalTranslation } from "@/component/legal/i18n/en.i18n";

function TermsPage() {
  const t = useTranslation({ en, ar }) as TLegalTranslation;

  return (
    <LegalDocument
      icon={ScrollText}
      title={t.termsPage.title}
      subtitle={t.termsPage.subtitle}
      lastUpdated={t.lastUpdated}
      intro={t.termsPage.intro}
      sections={t.termsPage.sections}
    />
  );
}

export default TermsPage;
