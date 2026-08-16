"use client";

import { Shield } from "lucide-react";
import { LegalDocument } from "@/component/legal/LegalDocument";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "@/component/legal/i18n/ar.i18n";
import { en, type TLegalTranslation } from "@/component/legal/i18n/en.i18n";

function PrivacyPage() {
  const t = useTranslation({ en, ar }) as TLegalTranslation;

  return (
    <LegalDocument
      icon={Shield}
      title={t.privacyPage.title}
      subtitle={t.privacyPage.subtitle}
      lastUpdated={t.lastUpdated}
      intro={t.privacyPage.intro}
      sections={t.privacyPage.sections}
    />
  );
}

export default PrivacyPage;
