"use client";

import { useMemo, useState } from "react";
import { History } from "lucide-react";
import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useMatchHistory, type MatchHistoryFilter } from "@/hooks/useMatchHistory";
import { MatchResultEnum } from "@/domain/enum/MatchResultEnum";
import { GTabs } from "@/component/common/GTabs";
import { GSpinner } from "@/component/common/GSpinner";
import { GEmpty } from "@/component/common/GEmpty";
import { GCard } from "@/component/common/GCard";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GPage } from "@/component/common/GPage";
import { MatchHistoryCard } from "@/component/history/MatchHistoryCard";
import { MatchHistorySummary } from "@/component/history/MatchHistorySummary";
import {
  formatMatchDate,
  getGameName,
  getResultLabel,
} from "@/component/history/matchHistory.utils";
import type { GTabItem } from "@/component/common/def/GTabs";
import { ar } from "./i18n/ar.i18n";
import { en, type THistoryTranslation } from "./i18n/en.i18n";

function MatchHistoryPage() {
  const [locale] = useLocale();
  const t = useTranslation({ en, ar }) as THistoryTranslation;
  const [filter, setFilter] = useState<MatchHistoryFilter>("all");
  const { matches, summary, loading } = useMatchHistory(filter);

  const tabs = useMemo<GTabItem<MatchHistoryFilter>[]>(
    () => [
      { id: "all", label: t.filters.all },
      { id: MatchResultEnum.Win, label: t.filters.win },
      { id: MatchResultEnum.Loss, label: t.filters.loss },
      { id: MatchResultEnum.Draw, label: t.filters.draw },
    ],
    [t],
  );

  return (
    <GPage width="md">
      <GPageHeader
        badge={
          <GBadge>
            <GIcon icon={History} size="xs" color="primary" />
            {t.badge}
          </GBadge>
        }
        title={t.title}
        subtitle={t.subtitle}
      />

      <MatchHistorySummary summary={summary} labels={t.summary} />

      <GCard padding="sm">
        <GTabs tabs={tabs} value={filter} onChange={setFilter} variant="pills" fullWidth indicator="bottom" className="mb-4" />

        {loading ? (
          <div className="flex justify-center py-16">
            <GSpinner size="lg" />
          </div>
        ) : matches.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={History} size="xl" color="muted" />}
            title={t.empty.title}
            description={filter === "all" ? t.empty.description : t.empty.filtered}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {matches.map((match) => (
              <MatchHistoryCard
                key={match.id}
                match={match}
                gameName={getGameName(match.game, t.games)}
                resultLabel={getResultLabel(match.result, t.results)}
                playedAtLabel={formatMatchDate(match.playedAt, locale)}
                versusLabel={t.versus}
              />
            ))}
          </div>
        )}
      </GCard>
    </GPage>
  );
}

export default MatchHistoryPage;
