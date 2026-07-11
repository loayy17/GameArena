"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/app/providers/GameProvider";
import { useTranslation } from "@/hooks/useSetting";
import { en as gameEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as gameAr } from "@/component/i18n/Game/ar.i18n";
import { GSpinner } from "@/component/common/GSpinner";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GameLobby } from "./GameLobby";
import { GameReady } from "./GameReady";
import { GameActive } from "./GameActive";
import { getGameConfig } from "./gameConfig";
import type { GameLayoutWrapperProps } from "./def/GameLayoutWrapper";

function GameLayoutWrapper({ children, gameType }: GameLayoutWrapperProps) {
  const game = useGame();
  const t = useTranslation({ en: gameEn, ar: gameAr }) as GameTranslations;

  const { state, isConnected, isInitialSyncDone, opponentDisconnected, findMatch, startGame, inviteToRoom, leaveGame, resetGame } = game;

  const hasInitiatedMatch = useRef(false);

  useEffect(() => {
    if (isInitialSyncDone && !state && !hasInitiatedMatch.current && isConnected) {
      hasInitiatedMatch.current = true;
      findMatch(gameType);
    }
  }, [isInitialSyncDone, state, findMatch, gameType, isConnected]);

  const gameInfo = getGameConfig(gameType);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-150 p-4">
        <GSpinner size="lg" />
      </div>
    );
  }

  if (!state.player2Id) {
    return (
      <GameLobby
        state={state}
        gameInfo={gameInfo}
        t={t}
        onStartVsAI={() => startGame(null, gameType)}
        onInviteFriend={(friendId) => inviteToRoom(friendId)}
        onCancel={resetGame}
      />
    );
  }

  if (!state.hasStarted) {
    return (
      <GameReady
        state={state}
        gameInfo={gameInfo}
        t={t}
        onStart={(opponentId) => startGame(opponentId, gameType)}
        onCancel={resetGame}
      />
    );
  }

  return (
    <GameActive
      state={state}
      gameInfo={gameInfo}
      t={t}
      opponentDisconnected={opponentDisconnected}
      onPlayAgain={() => findMatch(gameType)}
      onLobby={resetGame}
      onLeave={leaveGame}>
      {children}
    </GameActive>
  );
}

export { GameLayoutWrapper };
