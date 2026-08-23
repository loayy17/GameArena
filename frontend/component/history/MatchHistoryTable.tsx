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
  return (
    <GCard padding={SizeEnum.None} className="overflow-hidden">
      <GList items={matches} keyExtractor={(match) => match.id} pageSize={10} listClassName="divide-y divide-border/60">
        {(match) => {
          const game = GamesList[match.kind] ?? GamesList[0];
          const label = (gameLabels[match.kind] ?? gameLabels[GamesList[0].type] ?? "") as string;
          return (
            <div className="flex items-center justify-between px-4 py-3 gap-4">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <GIcon icon={game.icon} size={SizeEnum.sm} tile tileGradient={game.tileGradient} />
                <span className="font-medium text-text truncate">{label}</span>
              </div>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Link
                  href={`/profile/${match.opponent.id}`}
                  className="flex items-center gap-2 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
                  <GAvatar
                    firstName={match.opponent.firstName}
                    lastName={match.opponent.lastName}
                    avatarUrl={match.opponent.avatarUrl}
                    status={match.opponent.status}
                    size={SizeEnum.xs}
                  />
                  <span className="truncate text-text-secondary transition-colors hover:text-primary">
                    @{match.opponent.fullName ?? match.opponent.userName}
                  </span>
                </Link>
              </div>
              <div className="shrink-0">{resultBadge(match.result, winLabel, lossLabel, drawLabel)}</div>
              <div className="text-end text-xs text-text-muted whitespace-nowrap shrink-0">{new Date(match.completedAt).toLocaleString(locale)}</div>
            </div>
          );
        }}
      </GList>
    </GCard>
  );
}
