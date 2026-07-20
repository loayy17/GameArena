"use client";

import { Users, Lock } from "lucide-react";
import { useGame } from "@/app/providers/GameProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { getGameConfig } from "./gameConfig";
import { GAMES_BY_TYPE } from "@/domain/constants/games";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface GameEntryProps {
  gameType: GamesKindEnum;
}

function GameEntry({ gameType }: GameEntryProps) {
  const { findMatch, createLobby, searchError } = useGame();
  const t = useGameTranslation();
  const gameInfo = getGameConfig(gameType);
  const gameConfig = GAMES_BY_TYPE[gameType];

  return (
    <div className="flex items-center justify-center min-h-[150px] p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="space-y-4">
          <GIcon icon={gameConfig.icon} size="4xl" tile tileSize="xl" tileGradient={gameConfig.gradientClass} tileColor="on-primary" className="mx-auto shadow-glow" />
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-text">{gameInfo.name}</h1>
            <p className="text-text-secondary text-sm">{gameInfo.description}</p>
          </div>
        </div>

        {searchError && (
          <div role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {searchError}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <GButton onClick={() => findMatch(gameType)} fullWidth size="lg" leftIcon={<GIcon icon={Users} size="md" color="inherit" />}>
            {t.lobby.quick}
          </GButton>
          <GButton onClick={() => createLobby(gameType)} fullWidth size="lg" variant="secondary" leftIcon={<GIcon icon={Lock} size="md" color="inherit" />}>
            {t.lobby.invite}
          </GButton>
        </div>
      </div>
    </div>
  );
}

export { GameEntry };
