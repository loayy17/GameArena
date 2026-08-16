"use client";

import { GCard } from "@/component/common/GCard";
import { GPage } from "@/component/common/GPage";
import { PageHeader } from "@/component/common/PageHeader";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import type { LucideIcon } from "lucide-react";

interface ILegalSection {
  title: string;
  body: string;
}

interface ILegalDocumentProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  lastUpdated: string;
  intro: string;
  sections: ILegalSection[];
}

function LegalDocument({ icon, title, subtitle, lastUpdated, intro, sections }: ILegalDocumentProps) {
  return (
    <GPage size={SizeEnum.lg} className="py-6 sm:py-8">
      <PageHeader icon={icon} title={title} subtitle={subtitle} />
      <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.lg} className="space-y-6">
        <p className="text-xs text-text-muted">{lastUpdated}</p>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{intro}</p>
        {sections.map((section) => (
          <section key={section.title} className="space-y-2">
            <h2 className="text-lg font-semibold text-text">{section.title}</h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{section.body}</p>
          </section>
        ))}
      </GCard>
    </GPage>
  );
}

export { LegalDocument };
export type { ILegalDocumentProps, ILegalSection };
