"use client";

import { PlayerCard } from "./PlayerCard";

interface Player {
  id?: string;
  username?: string;
  isTurn: boolean;
  isYou: boolean;
}

interface GamePlayersHeaderProps {
  player1: Player;
  player2: Player;
  player1Symbol?: string;
  player2Symbol?: string;
  isBotGame: boolean;
  currentUserId?: string;
  myName: string;
  player1Fallback: string;
  player2Fallback: string;
  vsLabel?: string;
  youSuffix?: string;
  aiBotLabel?: string;
  turnLabel?: string;
  player1Colors?: {
    box: string;
    badge: string;
    turn: string;
  };
  player2Colors?: {
    box: string;
    badge: string;
    turn: string;
  };
}

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
    <div className="grid grid-cols-7 items-center bg-bg-card border border-border rounded-lg p-4">
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
    </div>
  );
}

export { GamePlayersHeader };
export type { GamePlayersHeaderProps, Player };
