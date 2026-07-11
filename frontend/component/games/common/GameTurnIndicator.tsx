"use client";

import { Zap } from "lucide-react";
import clsx from "clsx";
import { GIcon } from "@/component/common/GIcon";
import type { GameTurnIndicatorProps } from "./def/GameTurnIndicator";

function GameTurnIndicator({
  isMyTurn,
  currentTurnText,
  waitingText,
}: GameTurnIndicatorProps) {
  return (
    <div
      className={clsx(
        "w-full py-3 px-4 rounded-xl border text-center font-bold text-sm flex items-center justify-center gap-2",
        isMyTurn
          ? "bg-primary-muted border-primary/30 text-text"
          : "bg-surface border-border text-text-secondary",
      )}
    >
      <GIcon
        icon={Zap}
        size="sm"
        color="inherit"
        className={isMyTurn ? "text-neon-cyan" : "text-text-muted"}
      />
      {isMyTurn ? currentTurnText : waitingText}
    </div>
  );
}

export { GameTurnIndicator };
