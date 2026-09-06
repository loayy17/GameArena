"use client";

import { History } from "lucide-react";

import { ar } from "@/app/(dashboard)/history/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/history/i18n/fr.i18n";
import { en } from "@/app/(dashboard)/history/i18n/en.i18n";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { GSectionHeader } from "@/component/common/GSectionHeader";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useLocale, useTranslation } from "@/hooks/useSetting";

import { MatchHistoryItem } from "./MatchHistoryItem";

import type { THistoryTranslation } from "@/app/(dashboard)/history/i18n/en.i18n";
import type { IRecentHistorySectionProps } from "./def/RecentHistorySection";

function RecentHistorySection({ title, viewAll, emptyTitle, emptyDescription, matches, loading, error, onRetry, limit = 3 }: IRecentHistorySectionProps) {
  const [locale] = useLocale();
  const historyT = useTranslation<THistoryTranslation>({ en, ar, fr });
  const visibleMatches = matches.slice(0, limit);

  return (
    <section>
      <GSectionHeader icon={History} title={title} actionHref="/history" actionLabel={viewAll} />

      <GAsync loading={loading} error={error} errorTitle={historyT.error.title} retryLabel={historyT.error.retry} onRetry={onRetry} className="py-2">
        {visibleMatches.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={History} size={SizeEnum.xl} color={AccentColorEnum.Muted} className="opacity-50" />}
            title={emptyTitle}
            description={emptyDescription}
          />
        ) : (
          <GList items={visibleMatches} keyExtractor={(match) => match.id} listClassName="gap-3">
            {(match) => (
              <MatchHistoryItem
                match={match}
                winLabel={historyT.results.win}
                lossLabel={historyT.results.loss}
                drawLabel={historyT.results.draw}
                gameLabel={historyT.games[match.kind]}
                locale={locale}
                versusLabel={historyT.versus}
              />
            )}
          </GList>
        )}
      </GAsync>
    </section>
  );
}

export { RecentHistorySection };
