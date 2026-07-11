"use client";

import { PlayerCard } from "./PlayerCard";
import { GCard } from "@/component/common/GCard";
import type { GamePlayersHeaderProps } from "./def/GamePlayersHeader";

function GamePlayersHeader({
  player1,
  player2,
  player1Symbol,
  player2Symbol,
  isBotGame,
  currentUserId,
  myName,
  player1Fallback,
  player2Fallback,
  vsLabel = "VS",
  youSuffix,
  aiBotLabel,
  turnLabel,
  player1Colors,
  player2Colors,
}: GamePlayersHeaderProps) {
  return (
    <GCard padding="sm" className="grid grid-cols-7 items-center">
      <PlayerCard
        playerId={player1.id ?? undefined}
        playerUsername={player1.username ?? undefined}
        symbol={player1Symbol}
        isBot={isBotGame && player1.id !== currentUserId}
        isYou={player1.isYou}
        myName={myName}
        fallbackName={player1Fallback}
        isTurn={player1.isTurn}
        youSuffix={youSuffix}
        aiBotLabel={aiBotLabel}
        turnLabel={turnLabel}
        symbolColors={player1Colors}
      />

      <div className="col-span-1 flex flex-col items-center justify-center">
        <span className="text-xs font-bold text-text-muted">{vsLabel}</span>
        <div className="w-px h-10 bg-border/40 mt-1" />
      </div>

      <PlayerCard
        playerId={player2.id ?? undefined}
        playerUsername={player2.username ?? undefined}
        symbol={player2Symbol}
        isBot={isBotGame && player2.id !== currentUserId}
        isYou={player2.isYou}
        myName={myName}
        fallbackName={player2Fallback}
        isTurn={player2.isTurn}
        youSuffix={youSuffix}
        aiBotLabel={aiBotLabel}
        turnLabel={turnLabel}
        symbolColors={player2Colors}
      />
    </GCard>
  );
}

export { GamePlayersHeader };
