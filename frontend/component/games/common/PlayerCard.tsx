"use client";

import { Bot, User } from "lucide-react";
import clsx from "clsx";
import { GIcon } from "@/component/common/GIcon";
import type { PlayerCardProps } from "./def/PlayerCard";

function PlayerCard({
  playerId: _playerId,
  playerUsername,
  symbol,
  isBot,
  isYou,
  myName,
  fallbackName,
  isTurn,
  youSuffix = "(You)",
  aiBotLabel = "AI Bot",
  turnLabel = "Turn",
  symbolColors,
}: PlayerCardProps) {
  const name = isYou
    ? `${myName} ${youSuffix}`
    : isBot
      ? aiBotLabel
      : playerUsername || fallbackName;

  const colors = symbolColors;

  return (
    <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
      <div
        className={clsx(
          "relative w-16 h-16 rounded-xl flex items-center justify-center border-2",
          isTurn && colors ? colors.box : "border-border-light bg-surface",
        )}
      >
        {isBot ? (
          <GIcon icon={Bot} size="xl" color="inherit" className={symbol === "X" ? "text-neon-blue" : "text-neon-magenta"} />
        ) : (
          <GIcon icon={User} size="xl" color="secondary" />
        )}
        {symbol && colors && (
          <span
            className={clsx(
              "absolute -top-2 -end-2 w-6 h-6 rounded-full text-on-primary text-xs font-bold flex items-center justify-center",
              colors.badge,
            )}
          >
            {symbol}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-text mt-3 truncate max-w-28">
        {name}
      </span>
      {isTurn && colors && (
        <span className={clsx("text-xs font-medium mt-1", colors.turn)}>
          {turnLabel}
        </span>
      )}
    </div>
  );
}

export { PlayerCard };
