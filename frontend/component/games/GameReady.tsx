"use client";

import { Play } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GCard } from "@/component/common/GCard";
import { getGameConfig } from "./gameConfig";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";

interface GameReadyProps {
  gameType: GamesKindEnum;
}

function GameReady({ gameType }: GameReadyProps) {
  const { user } = useAuth();
  const { state, startGame } = useGame();
  const t = useGameTranslation();

  if (!state) return null;

  const isHost = user?.id === state.player1Id;
  const gameInfo = getGameConfig(gameType);

  return (
    <div className="flex items-center justify-center min-h-[150px] p-4">
      <GCard padding="lg" className="w-full max-w-lg text-center relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
        <h2 className="text-2xl font-black text-text mb-6">{t.ready.title}</h2>

        <div className="flex items-center justify-center gap-6 mb-10">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-accent bg-accent-muted shadow-glow">
              <span className="text-3xl font-bold text-accent">{gameInfo.symbol1}</span>
            </div>
            <span className="text-sm font-bold mt-3 text-text truncate max-w-28">
              {state.player1Id === user?.id ? t.game.you : state.player1Username}
            </span>
          </div>

          <div className="text-text-muted font-black italic text-xl">{t.game.vs}</div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center border-2 border-warning bg-warning-bg">
              <span className="text-3xl font-bold text-warning">{gameInfo.symbol2}</span>
            </div>
            <span className="text-sm font-bold mt-3 text-text truncate max-w-28">
              {state.player2Id === user?.id ? t.game.you : state.player2Username}
            </span>
          </div>
        </div>

        <GButton
          disabled={!isHost}
          onClick={() => startGame(state.player2Id!, gameType)}
          fullWidth
          size="lg"
          leftIcon={<GIcon icon={Play} size="lg" color="inherit" />}>
          {isHost ? t.ready.startGame : t.ready.waitingForStart}
        </GButton>
      </GCard>
    </div>
  );
}

export { GameReady };
