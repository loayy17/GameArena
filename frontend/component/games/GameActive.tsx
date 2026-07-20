"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { GamePlayersHeader } from "@/component/games/common/GamePlayersHeader";
import { GameTurnIndicator } from "@/component/games/common/GameTurnIndicator";
import { GameResult } from "@/component/games/common/GameResult";
import { GButton } from "@/component/common/GButton";
import type { ReactNode } from "react";

interface GameActiveProps {
  children: ReactNode;
}

function GameActive({ children }: GameActiveProps) {
  const { user } = useAuth();
  const { state, leaveGame } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const opponentName = state.isBotGame
    ? t.game.aiBot
    : state.player1Id === user?.id
      ? state.player2Username || t.game.opponent
      : state.player1Username || t.game.opponent;

  const isMyTurn = state.currentTurnPlayerId === user?.id;

  return (
    <div className="flex items-center justify-center min-h-[150px] p-4">
      <div className="w-full max-w-lg space-y-6">
        <GamePlayersHeader />

        {!(state.winnerPlayerId || state.isFinished) && (
          <GameTurnIndicator
            isMyTurn={isMyTurn}
            currentTurnText={t.game.yourTurn}
            waitingText={t.game.waitingFor.replace("{name}", opponentName)}
          />
        )}

        <div className="relative">
          {children}
          <GameResult />
        </div>

        {!(state.winnerPlayerId || state.isFinished) && (
          <div className="flex justify-center">
            <GButton onClick={() => leaveGame()} variant="dangerOutline" size="sm">
              {t.game.leaveGame}
            </GButton>
          </div>
        )}
      </div>
    </div>
  );
}

export { GameActive };
