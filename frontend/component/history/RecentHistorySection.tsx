"use client";

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";

import { ar } from "@/app/(dashboard)/history/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/history/i18n/fr.i18n";
import { en, type THistoryTranslation } from "@/app/(dashboard)/history/i18n/en.i18n";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
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
  const { matches, loading, error } = useMatchHistory(MatchStatusEnum.All, limit);

  return (
    <section>
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary-muted">
            <GIcon icon={History} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
          </div>
          <h2 className="text-xl font-bold text-text">{title}</h2>
        </div>
        <Link
          href="/history"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary-hover">
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
        )}
      </GAsync>
    </section>
  );
}

export { RecentHistorySection };
