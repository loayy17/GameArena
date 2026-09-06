"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, History } from "lucide-react";

import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { GList } from "@/component/common/GList";
import { GTabs } from "@/component/common/GTabs";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GPage } from "@/component/common/GPage";
import { GPageHeader } from "@/component/common/GPageHeader";
import { MatchHistoryItem } from "@/component/history/MatchHistoryItem";
import { MatchHistoryTable } from "@/component/history/MatchHistoryTable";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en } from "./i18n/en.i18n";

import type { THistoryTranslation } from "./i18n/en.i18n";
import type { IGTabItem } from "@/component/common/def/GTabs";

export default function MatchHistoryPage() {
  const [locale] = useLocale();
  const t = useTranslation<THistoryTranslation>({ en, ar, fr });
  const [filter, setFilter] = useState(MatchStatusEnum.All);
  const { matches, loading, error, reload } = useMatchHistory(filter);
  const tabs = useMemo<IGTabItem<MatchStatusEnum>[]>(
    () => [
      { id: MatchStatusEnum.All, label: t.filters.all },
      { id: MatchStatusEnum.Win, label: t.filters.win },
      { id: MatchStatusEnum.Lost, label: t.filters.loss },
      { id: MatchStatusEnum.Draw, label: t.filters.draw },
    ],
    [t],
  );

  return (
    <GPage size={SizeEnum.lg}>
      <GPageHeader
        icon={History}
        title={t.title}
        subtitle={t.subtitle}
        className="hidden md:block"
        badge={
          <GBadge>
            <GIcon icon={History} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
            {t.badge}
          </GBadge>
        }
      />
      <GTabs tabs={tabs} value={filter} onChange={setFilter} className="mb-4" tabClassName="w-full md:flex-1 md:justify-center" />

      <GAsync
        loading={loading}
        error={error}
        spinnerSize={SizeEnum.lg}
        errorTitle={t.error.title}
        errorIcon={AlertTriangle}
        retryLabel={t.error.retry}
        onRetry={reload}
        className="py-16">
        {matches.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={History} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
            title={t.empty.title}
            description={filter === MatchStatusEnum.All ? t.empty.description : t.empty.filtered}
          />
        ) : (
          <>
            <div className="hidden sm:block overflow-x-auto">
              <MatchHistoryTable
                matches={matches}
                locale={locale}
                winLabel={t.results.win}
                lossLabel={t.results.loss}
                drawLabel={t.results.draw}
                gameLabels={t.games}
              />
            </div>
            <div className="sm:hidden">
              <GList items={matches} keyExtractor={(match) => match.id} pageSize={10} listClassName="gap-3">
                {(match) => (
                  <MatchHistoryItem
                    match={match}
                    locale={locale}
                    winLabel={t.results.win}
                    lossLabel={t.results.loss}
                    drawLabel={t.results.draw}
                    versusLabel={t.versus}
                    gameLabel={t.games[match.kind]}
                  />
                )}
              </GList>
            </div>
          </>
        )}
      </GAsync>
    </GPage>
  );
}
