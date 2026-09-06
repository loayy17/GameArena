import Link from "next/link";

import { GAvatar } from "@/component/common/GAvatar";
import { GBadge } from "@/component/common/GBadge";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { GamesList } from "@/domain/constant/games";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { IMatchHistoryTableProps } from "./def/MatchHistoryTable";

function resultBadge(result: MatchStatusEnum, winLabel: string, lossLabel: string, drawLabel: string) {
  const isWin = result === MatchStatusEnum.Win;
  const isLoss = result === MatchStatusEnum.Lost;
  return (
    <GBadge variant={isWin ? AccentColorEnum.Success : isLoss ? AccentColorEnum.Danger : AccentColorEnum.Warning} size={SizeEnum.sm}>
      {isWin ? winLabel : isLoss ? lossLabel : drawLabel}
    </GBadge>
  );
}

export function MatchHistoryTable({ matches, locale, winLabel, lossLabel, drawLabel, gameLabels }: IMatchHistoryTableProps) {
  const rowClass = "grid grid-cols-[minmax(0,1.2fr)_minmax(0,1.6fr)_auto_auto] items-center gap-4 px-4 py-3";
  return (
    <GCard className="p-0">
      <GList items={matches} keyExtractor={(match) => match.id} pageSize={10} listClassName="divide-y divide-border/60">
        {(match) => {
          const game = GamesList[match.kind] ?? GamesList[0];
          const label = gameLabels[match.kind];
          return (
            <div className={rowClass}>
              <div className="flex items-center gap-3 min-w-0">
                <GIcon icon={game.icon} variant="tile" size={SizeEnum.sm} gradient={game.tileGradient} />
                <span className="font-medium text-text truncate">{label}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <Link
                  href={`/profile/${match.opponent.id}`}
                  className="flex items-center gap-2 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  <GAvatar user={match.opponent} size={SizeEnum.xs} />
                  <span className="truncate text-text-secondary hover:text-primary">
                    {match.opponent.fullName || (match.opponent.userName ? `@${match.opponent.userName}` : "")}
                  </span>
                </Link>
              </div>
              <div>{resultBadge(match.result, winLabel, lossLabel, drawLabel)}</div>
              <div className="text-end text-xs text-text-muted whitespace-nowrap">{new Date(match.completedAt).toLocaleString(locale)}</div>
            </div>
          );
        }}
      </GList>
    </GCard>
  );
}
