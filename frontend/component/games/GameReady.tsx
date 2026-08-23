"use client";

import { Play } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { getGameConfig } from "@/domain/constant/games";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";

import type { IGameReadyProps } from "./def/GameReady";

function GameReady({ gameType }: IGameReadyProps) {
  const { user } = useAuth();
  const { state, startGame } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const isHost = user?.id === state.player1Id;
  const gameInfo = getGameConfig(gameType);

  return (
    <div className="flex items-center justify-center p-4">
      <GCard padding={SizeEnum.lg} className="w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold text-text mb-6">{t.ready.title}</h2>

        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="flex flex-col items-center">
            <div className="size-20 rounded-2xl flex items-center justify-center border-2 border-accent bg-accent-muted">
              <span className="text-3xl font-bold text-accent">{gameInfo.symbol1}</span>
            </div>
            <span className="text-sm font-bold mt-3 text-text truncate max-w-28">
              {state.player1Id === user?.id ? t.game.you : state.player1Username}
            </span>
          </div>

          <div className="text-text-muted font-bold italic text-xl">{t.game.vs}</div>

          <div className="flex flex-col items-center">
            <div className="size-20 rounded-2xl flex items-center justify-center border-2 border-warning bg-warning-bg">
              <span className="text-3xl font-bold text-warning">{gameInfo.symbol2}</span>
            </div>
            <span className="text-sm font-bold mt-3 text-text truncate max-w-28">
              {state.player2Id === user?.id ? t.game.you : state.player2Username}
            </span>
          </div>
        </div>

        <GButtonAsync
          disabled={!isHost}
          onClick={() => startGame(state.player2Id ?? null, gameType)}
          fullWidth
          size={SizeEnum.lg}
          startIcon={<GIcon icon={Play} size={SizeEnum.lg} />}>
          {isHost ? t.ready.startGame : t.ready.waitingForStart}
        </GButtonAsync>
      </GCard>
    </div>
  );
}

export { GameReady };
