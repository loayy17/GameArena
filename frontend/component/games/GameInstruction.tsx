"use client";

import { HelpCircle } from "lucide-react";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { translateGameInfo } from "@/domain/constant/games";
import type { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { GameVisualGuide } from "./common/GameVisualGuide";

interface IGameInstructionProps {
  gameType: GamesKindEnum;
}

function GameInstruction({ gameType }: IGameInstructionProps) {
  const t = useGameTranslation();

  const { instruction, guide } = translateGameInfo(t, gameType);

  if (!instruction) return null;

  return (
    <div className="w-full rounded-xl border border-border/60 bg-bg-card p-4 text-start">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-text">
        <GIcon icon={HelpCircle} size={SizeEnum.sm} />
        {t.game.howToPlay}
      </h2>
      <div className="mt-3 space-y-3">
        <GameVisualGuide gameType={gameType} guide={guide} />
        <p className="text-sm text-text-secondary leading-relaxed">{instruction}</p>
      </div>
    </div>
  );
}

export { GameInstruction };
