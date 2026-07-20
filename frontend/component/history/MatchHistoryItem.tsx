import { GamesList } from "@/domain/constant/games";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { GBadge } from "@/component/common/GBadge";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import type { IMatchHistory } from "@/domain/meta/IMatchHistory";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import type { MatchHistoryItemProps } from "./def/MatchHistoryItem";
import { Gamepad2 } from "lucide-react";

export function MatchHistoryItem({ match, locale, winLabel, lossLabel, drawLabel, versusLabel, gameLabel }: MatchHistoryItemProps) {
  const game = match.kind != GamesKindEnum.None ? GamesList[match.kind] : undefined;
  const isWin = match.result === MatchStatusEnum.Win;
  const isLoss = match.result === MatchStatusEnum.Lost;
  const badgeVariant = isWin ? "success" : isLoss ? "danger" : "warning";
  const resultLabel = isWin ? winLabel : isLoss ? lossLabel : drawLabel;

  return (
    <GCard padding="sm" className="flex items-center gap-4">
      <GIcon icon={game?.icon ?? Gamepad2} size="md" tile tileSize="md" tileGradient={game?.gradient} />
      <div className="min-w-0 flex-1">
        <div className="mb-2 flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-text sm:text-base">{gameLabel}</h3>
          <GBadge variant={badgeVariant} size="sm" className="shrink-0">
            {" "}
            {resultLabel}
          </GBadge>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-text-secondary sm:text-sm">
          <p className="truncate">
            {versusLabel} <span className="font-medium text-text">@{match.opponent.fullName}</span>
          </p>
          <p className="shrink-0 text-2xs text-text-muted sm:text-xs">{new Date(match.completedAt).toLocaleString(locale)}</p>
        </div>
      </div>
    </GCard>
  );
}
