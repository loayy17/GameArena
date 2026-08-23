"use client";

import { Zap, Crown } from "lucide-react";

import { useGame } from "@/app/providers/GameProvider";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GIcon } from "@/component/common/GIcon";
import { GAMES_BY_TYPE, translateGameInfo } from "@/domain/constant/games";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { IGameEntryProps } from "./def/GameEntry";
import { GameInstruction } from "./GameInstruction";

function GameEntry({ gameType }: IGameEntryProps) {
  const { findMatch, createLobby, searchError } = useGame();
  const t = useGameTranslation();
  const { name: gameName, description: gameDescription } = translateGameInfo(t, gameType);
  const gameConfig = GAMES_BY_TYPE[gameType];

  return (
    <div className="flex items-center justify-center min-h-37.5 p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="space-y-4">
          <GIcon
            icon={gameConfig.icon}
            size={SizeEnum.xl}
            tile
            tileGradient={gameConfig.tileGradient}
            tileColor={AccentColorEnum.OnPrimary}
            className="mx-auto"
          />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text tracking-tight">{gameName}</h1>
            <p className="text-text-secondary text-sm leading-relaxed">{gameDescription}</p>
          </div>
        </div>

        {searchError && (
          <div role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {searchError}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <GButtonAsync
            onClick={() => findMatch(gameType)}
            fullWidth
            size={SizeEnum.lg}
            startIcon={<GIcon icon={Zap} size={SizeEnum.md} />}>
            {t.lobby.quick}
          </GButtonAsync>
          <GButtonAsync
            onClick={() => createLobby(gameType)}
            fullWidth
            size={SizeEnum.lg}
            variant={ButtonVariantEnum.Secondary}
            startIcon={<GIcon icon={Crown} size={SizeEnum.md} />}>
            {t.lobby.invite}
          </GButtonAsync>
        </div>

        <GameInstruction gameType={gameType} />
      </div>
    </div>
  );
}

export { GameEntry };
