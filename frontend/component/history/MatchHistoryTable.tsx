import { GamesList } from "@/domain/constant/games";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";
import { GAvatar } from "@/component/common/GAvatar";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import { Gamepad2 } from "lucide-react";

interface MatchHistoryTableProps {
  matches: IMatchHistory[];
  locale: string;
  winLabel: string;
  lossLabel: string;
  drawLabel: string;
  gameLabels: Record<GamesKindEnum, string>;
  columns: { game: string; opponent: string; result: string; date: string };
}

function resultBadge(result: MatchStatusEnum, winLabel: string, lossLabel: string, drawLabel: string) {
  const isWin = result === MatchStatusEnum.Win;
  const isLoss = result === MatchStatusEnum.Lost;
  return (
    <GBadge variant={isWin ? "success" : isLoss ? "danger" : "warning"} size="sm">
      {isWin ? winLabel : isLoss ? lossLabel : drawLabel}
    </GBadge>
  );
}

export function MatchHistoryTable({ matches, locale, winLabel, lossLabel, drawLabel, gameLabels, columns }: MatchHistoryTableProps) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="border-b border-border text-start text-xs font-semibold uppercase tracking-wide text-text-muted">
          <th scope="col" className="py-3 pe-4 text-start font-semibold">{columns.game}</th>
          <th scope="col" className="py-3 pe-4 text-start font-semibold">{columns.opponent}</th>
          <th scope="col" className="py-3 pe-4 text-start font-semibold">{columns.result}</th>
          <th scope="col" className="py-3 text-end font-semibold">{columns.date}</th>
        </tr>
      </thead>
      <tbody>
        {matches.map((match) => {
          const game = match.kind !== GamesKindEnum.None ? GamesList[match.kind] : undefined;
          return (
            <tr key={match.id} className="border-b border-border/50 last:border-0 hover:bg-surface/50 transition-colors">
              <td className="py-3 pe-4">
                <div className="flex items-center gap-3">
                  <GIcon icon={game?.icon ?? Gamepad2} size="sm" tile tileSize="sm" tileGradient={game?.gradient} />
                  <span className="font-medium text-text">{gameLabels[match.kind]}</span>
                </div>
              </td>
              <td className="py-3 pe-4">
                <div className="flex items-center gap-2 min-w-0">
                  <GAvatar
                    firstName={match.opponent.firstName}
                    lastName={match.opponent.lastName}
                    status={match.opponent.status}
                    size="xs"
                    shape="circle"
                  />
                  <span className="truncate text-text-secondary">@{match.opponent.fullName ?? match.opponent.userName}</span>
                </div>
              </td>
              <td className="py-3 pe-4">{resultBadge(match.result, winLabel, lossLabel, drawLabel)}</td>
              <td className="py-3 text-end text-xs text-text-muted whitespace-nowrap">
                {new Date(match.completedAt).toLocaleString(locale)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
