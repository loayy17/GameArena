"use client";

import Link from "next/link";
import { ArrowRight, Frown, Handshake, History, Trophy } from "lucide-react";

import { ar } from "@/app/(dashboard)/history/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/history/i18n/fr.i18n";
import { en, type THistoryTranslation } from "@/app/(dashboard)/history/i18n/en.i18n";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { GCard } from "@/component/common/GCard";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { useLocale, useTranslation } from "@/hooks/useSetting";

import { MatchHistoryItem } from "./MatchHistoryItem";
import type { IRecentHistorySectionProps } from "./def/RecentHistorySection";

function RecentHistorySection({ title, viewAll, emptyTitle, emptyDescription, limit = 3 }: IRecentHistorySectionProps) {
  const [locale] = useLocale() as [LocaleEnum, (l: LocaleEnum) => void];
  const historyT = useTranslation({ en, ar, fr }) as THistoryTranslation;
  const { matches, summary, loading, error } = useMatchHistory(MatchStatusEnum.All, limit);

  const items = [
    { label: historyT.summary.wins, value: summary.wins, icon: Trophy, backGroundColor: AccentColorEnum.Success },
    { label: historyT.summary.losses, value: summary.losses, icon: Frown, backGroundColor: AccentColorEnum.Danger },
    { label: historyT.summary.draws, value: summary.draws, icon: Handshake, backGroundColor: AccentColorEnum.Warning },
  ];

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-widest">{title}</h2>
        <Link href="/history" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover">
          {viewAll}
          <GIcon icon={ArrowRight} size={SizeEnum.xs} color={AccentColorEnum.Primary} flip />
        </Link>
      </div>

      <GAsync loading={loading} error={error} className="py-2">
        {matches.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={History} size={SizeEnum.xl} color={AccentColorEnum.Muted} className="opacity-50" />}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <GList items={items} keyExtractor={(item) => item.label} listClassName="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(item) => (
                <GCard padding={SizeEnum.sm} className="flex items-center gap-3">
                  <GIcon icon={item.icon} size={SizeEnum.md} color={AccentColorEnum.Muted} tile tileGradient={item.backGroundColor} />
                  <div>
                    <p className="text-xl font-extrabold leading-tight text-text">{item.value}</p>
                    <p className="text-xs font-medium text-text-secondary mt-0.5">{item.label}</p>
                  </div>
                </GCard>
              )}
            </GList>
            <GList items={matches} keyExtractor={(match) => match.id} listClassName="gap-3">
              {(match) => (
                <MatchHistoryItem
                  match={match}
                  winLabel={historyT.results.win}
                  lossLabel={historyT.results.loss}
                  drawLabel={historyT.results.draw}
                  gameLabel={historyT.games[match.kind as keyof typeof historyT.games]}
                  locale={locale}
                  versusLabel={historyT.versus}
                />
              )}
            </GList>
          </div>
        )}
      </GAsync>
    </section>
  );
}

export { RecentHistorySection };
