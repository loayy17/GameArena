"use client";

import { useGame } from "@/app/providers/GameProvider";
import { useTranslation } from "@/hooks/useSetting";
import { en as gameEn, type GameTranslations } from "@/component/i18n/Game/en.i18n";
import { ar as gameAr } from "@/component/i18n/Game/ar.i18n";
import { GSpinner } from "@/component/common/GSpinner";
import { GameEntry } from "./GameEntry";
import { GameLobby } from "./GameLobby";
import { GameReady } from "./GameReady";
import { GameActive } from "./GameActive";
import { getGameConfig } from "./gameConfig";
import type { GameLayoutWrapperProps } from "./def/GameLayoutWrapper";

function GameLayoutWrapper({ children, gameType }: GameLayoutWrapperProps) {
  const game = useGame();
  const t = useTranslation({ en: gameEn, ar: gameAr }) as GameTranslations;

  const { state, isConnected, isInitialSyncDone, opponentDisconnected, findMatch, createLobby, startGame, inviteToRoom, leaveGame, requestPlayAgain, respondPlayAgain, resetGame, pendingPlayAgainRequest, requestedPlayAgain } = game;

  const gameInfo = getGameConfig(gameType);

  if (!state) {
    if (!isInitialSyncDone || !isConnected) {
      return (
        <div className="flex items-center justify-center min-h-150 p-4">
          <GSpinner size="lg" />
        </div>
      );
    }
    return (
      <GameEntry
        gameInfo={gameInfo}
        t={t}
        onQuickMatch={() => findMatch(gameType)}
        onCreatePrivate={() => createLobby(gameType)}
      />
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
      />
    );
  }

  return (
    <GameActive
      state={state}
      gameInfo={gameInfo}
      t={t}
      opponentDisconnected={opponentDisconnected}
      onPlayAgain={requestPlayAgain}
      onLobby={leaveGame}
      onLeave={leaveGame}
      requestedPlayAgain={requestedPlayAgain}
      onRespondPlayAgain={respondPlayAgain}
      pendingRequest={pendingPlayAgainRequest}>
      {children}
    </GameActive>
  );
}

export { GameLayoutWrapper };
