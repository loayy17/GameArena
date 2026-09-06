import Link from "next/link";

import { GBadge } from "@/component/common/GBadge";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GamesList } from "@/domain/constant/games";
import { focusRing } from "@/domain/constant/style-tokens";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { MatchStatusEnum } from "@/domain/enum/MatchStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { cn } from "@/lib/cn";

import type { IMatchHistoryItemProps } from "./def/MatchHistoryItem";

export function MatchHistoryItem({ match, locale, winLabel, lossLabel, drawLabel, versusLabel, gameLabel }: IMatchHistoryItemProps) {
  const game = GamesList[match.kind];
  const isWin = match.result === MatchStatusEnum.Win;
  const isLoss = match.result === MatchStatusEnum.Lost;
  const badgeVariant = isWin ? AccentColorEnum.Success : isLoss ? AccentColorEnum.Danger : AccentColorEnum.Warning;
  const resultLabel = isWin ? winLabel : isLoss ? lossLabel : drawLabel;

  return (
    <GCard className="flex items-center gap-3 p-3">
      <GIcon icon={game.icon} variant="tile" size={SizeEnum.md} gradient={game.tileGradient} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-text">{gameLabel}</h3>
          <GBadge variant={badgeVariant} size={SizeEnum.sm} className="shrink-0">
            {resultLabel}
          </GBadge>
        </div>
        <div className="flex items-center justify-between gap-3 text-xs text-text-secondary sm:text-sm">
          <p className="truncate">
            {versusLabel}{" "}
            <Link href={`/profile/${match.opponent.id}`} className={cn("rounded font-medium text-text hover:text-primary", focusRing)}>
              {match.opponent.fullName || (match.opponent.userName ? `@${match.opponent.userName}` : "")}
            </Link>
          </p>
          <p className="shrink-0 text-2xs text-text-muted sm:text-xs">{new Date(match.completedAt).toLocaleString(locale)}</p>
        </div>
      </div>
    </GCard>
  );
}
