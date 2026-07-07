"use client";

import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { GIconTile } from "@/component/common/GIconTile";
import { MatchResultBadge } from "./MatchResultBadge";
import type { IMatchHistoryCardProps } from "./def/IMatchHistoryCard";
import { matchGameMeta } from "@/domain/constant/match_history.config";

function MatchHistoryCard({
  match,
  gameName,
  resultLabel,
  playedAtLabel,
  versusLabel,
  compact = false,
}: IMatchHistoryCardProps) {
  const meta = matchGameMeta[match.game];
  const Icon = meta.icon;

  return (
    <GCard
      variant="interactive"
      padding="sm"
      className={compact ? "flex items-center gap-3" : "flex items-center gap-4"}
    >
      <GIconTile gradient={meta.gradient} size={compact ? "sm" : "md"}>
        <GIcon icon={Icon} size={compact ? "sm" : "md"} color="inherit" className="text-text" />
      </GIconTile>

      <div className="min-w-0 flex-1 text-start">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <h3 className="text-text font-bold text-sm sm:text-base truncate">
            {gameName}
          </h3>
          <MatchResultBadge result={match.result} label={resultLabel} />
        </div>
        <p className="text-text-secondary text-xs sm:text-sm truncate">
          {versusLabel}{" "}
          <span className="text-text font-medium">@{match.opponentName}</span>
          {match.score ? (
            <span className="text-text-muted"> · {match.score}</span>
          ) : null}
        </p>
        {!compact && (
          <p className="text-text-muted text-2xs mt-1">{playedAtLabel}</p>
        )}
      </div>

      {compact && (
        <p className="text-text-muted text-2xs shrink-0">{playedAtLabel}</p>
      )}
    </GCard>
  );
}

export { MatchHistoryCard };
