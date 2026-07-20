"use client";

import { useGame } from "@/app/providers/GameProvider";
import { GSpinner } from "@/component/common/GSpinner";
import { GameEntry } from "./GameEntry";
import { GameLobby } from "./GameLobby";
import { GameReady } from "./GameReady";
import { GameActive } from "./GameActive";
import type { GameLayoutWrapperProps } from "./def/GameLayoutWrapper";

function GameLayoutWrapper({ children, gameType }: GameLayoutWrapperProps) {
  const { state, isConnected, isInitialSyncDone, isSearching } = useGame();

  if (!state) {
    if (!isInitialSyncDone || !isConnected) {
      return (
        <div className="flex items-center justify-center min-h-[150px] p-4">
          <GSpinner size="lg" />
        </div>
      );
    }
    if (isSearching) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[150px] p-4 gap-4 text-center">
          <GSpinner size="lg" />
          <p className="text-text-secondary text-sm">Searching for opponent...</p>
        </div>
      );
    }
    return <GameEntry gameType={gameType} />;
  }

  if (!state.player2Id) return <GameLobby gameType={gameType} />;
  if (!state.hasStarted) return <GameReady gameType={gameType} />;
  return <GameActive>{children}</GameActive>;
}

export { GameLayoutWrapper };
