"use client";

import { cn } from "@/lib/cn";

import { useGameTranslation } from "@/hooks/useGameTranslation";
import type { IScoreBoardProps, IScoreSide } from "./def/ScoreBoard";

function ScoreColumn({ side, compact }: { side: IScoreSide; compact: boolean }) {
  return (
    <div className="text-center">
      {compact && <div className="text-sm text-text-muted uppercase tracking-wider">{side.label}</div>}
      <div className={cn(compact ? "text-2xl" : "text-3xl", "font-bold", side.colorClass ?? "text-accent")}>{side.score}</div>
      {!compact && <div className="text-xs text-text-muted font-medium mt-1 uppercase tracking-wider">{side.label}</div>}
    </div>
  );
}

function ScoreBoard({ left, right, winScore, variant = "vs", className }: IScoreBoardProps) {
  const t = useGameTranslation();

  if (variant === "compact") {
    return (
      <div className={cn("flex justify-between items-center", className)}>
        <ScoreColumn side={left} compact />
        <ScoreColumn side={right} compact />
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center gap-8", className)}>
      <ScoreColumn side={left} compact={false} />
      <div className="text-center text-text-muted font-bold flex flex-col justify-center">
        <span className="text-sm">{t.game.vs}</span>
        {winScore != null && <span className="text-xs mt-0.5">{t.game.firstTo.replace("{score}", String(winScore))}</span>}
      </div>
      <ScoreColumn side={right} compact={false} />
    </div>
  );
}

export { ScoreBoard };
