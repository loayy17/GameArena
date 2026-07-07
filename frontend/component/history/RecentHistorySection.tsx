"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { GSpinner } from "@/component/common/GSpinner";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { MatchHistoryCard } from "./MatchHistoryCard";
import { MatchHistorySummary } from "./MatchHistorySummary";
import {
  formatMatchDate,
  getGameName,
  getResultLabel,
} from "./matchHistory.utils";
import { ar } from "@/app/(dashboard)/history/i18n/ar.i18n";
import {
  en,
  type THistoryTranslation,
} from "@/app/(dashboard)/history/i18n/en.i18n";

interface RecentHistorySectionProps {
  title: string;
  viewAll: string;
  emptyTitle: string;
  emptyDescription: string;
  limit?: number;
}

function RecentHistorySection({
  title,
  viewAll,
  emptyTitle,
  emptyDescription,
  limit = 3,
}: RecentHistorySectionProps) {
  const [locale] = useLocale();
  const historyT = useTranslation({ en, ar }) as THistoryTranslation;
  const { matches, summary, loading } = useMatchHistory("all", limit);

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
          {title}
        </h2>
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
        >
          {viewAll}
          <GIcon icon={ArrowRight} size="xs" color="primary" />
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <GSpinner />
        </div>
      ) : matches.length === 0 ? (
        <GEmpty
          icon={<GIcon icon={History} size="xl" color="muted" className="opacity-50" />}
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <MatchHistorySummary summary={summary} labels={historyT.summary} />
          <div className="flex flex-col gap-2">
            {matches.map((match) => (
              <MatchHistoryCard
                key={match.id}
                match={match}
                compact
                gameName={getGameName(match.game, historyT.games)}
                resultLabel={getResultLabel(match.result, historyT.results)}
                playedAtLabel={formatMatchDate(match.playedAt, locale)}
                versusLabel={historyT.versus}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export { RecentHistorySection };
