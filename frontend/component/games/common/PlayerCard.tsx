"use client";

import { Bot, User } from "lucide-react";
import clsx from "clsx";

interface PlayerCardProps {
  playerId?: string;
  playerUsername?: string;
  symbol?: string;
  isBot?: boolean;
  isYou?: boolean;
  myName: string;
  fallbackName: string;
  isTurn: boolean;
  youSuffix?: string;
  aiBotLabel?: string;
  turnLabel?: string;
  symbolColors?: {
    box: string;
    badge: string;
    turn: string;
  };
}

const defaultSymbolColors: Record<string, { box: string; badge: string; turn: string }> = {
  X: {
    box: "border-accent bg-accent-muted",
    badge: "bg-accent",
    turn: "text-accent",
  },
  O: {
    box: "border-warning bg-warning-bg",
    badge: "bg-warning",
    turn: "text-warning",
  },
};

function PlayerCard({
  playerId,
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
  const colors = symbolColors ?? (symbol ? defaultSymbolColors[symbol] : undefined);
  const name = isYou
    ? `${myName} ${youSuffix}`
    : isBot
      ? aiBotLabel
      : playerUsername || fallbackName;

  return (
    <div className="col-span-3 flex flex-col items-center text-center p-2 relative">
      <div
        className={clsx(
          "relative w-16 h-16 rounded-xl flex items-center justify-center border-2",
          isTurn && colors ? colors.box : "border-border-light bg-surface",
        )}
      >
        {isBot ? (
          <Bot className={clsx("w-8 h-8", symbol === "X" ? "text-neon-blue" : "text-neon-magenta")} />
        ) : (
          <User className="w-8 h-8 text-text-secondary" />
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
      <span className="text-sm font-semibold text-text mt-3 truncate max-w-[7rem]">
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
export type { PlayerCardProps };
