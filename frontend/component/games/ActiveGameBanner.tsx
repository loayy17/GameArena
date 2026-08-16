"use client";

import { ArrowRight, Gamepad2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/app/providers/GameProvider";
import { GamesList } from "@/domain/constant/games";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "../common/GCard";
import { en, type TGamesTranslation } from "@/app/(dashboard)/games/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/games/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/games/i18n/fr.i18n";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";

function ActiveGameBanner() {
  const { state, lastGameType } = useGame();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation({ en, ar, fr }) as TGamesTranslation & { returnToGame: string; gameRunning: string };
  const isActive = state?.hasStarted === true && state?.isFinished === false;
  const isOnGamePage = pathname.startsWith("/games/") && pathname !== "/games";

  if (!isActive || isOnGamePage) return null;

  const gamePath = lastGameType !== null ? (GamesList.find((g) => g.type === (lastGameType as typeof g.type))?.path ?? "tic-tac-toe") : "tic-tac-toe";
  const game = GamesList.find((g) => g.type === (lastGameType as typeof g.type)) ?? GamesList[0];

  const gameNameKey = (gameId: string): keyof typeof t => {
    switch (gameId) {
      case "pingpong":
        return "pong";
      case "snake":
        return "snake";
      default:
        return "ticTacToe";
    }
  };

  return (
    <div className="fixed banner-position inset-inline-4 sm:inset-inline-end-4 sm:w-96 sm:max-w-none z-fixed">
      <GCard variant={CardVariantEnum.Default} padding={SizeEnum.md} className="flex items-center gap-4 pb-safe">
        <GIcon icon={game.icon} size={SizeEnum.lg} color={AccentColorEnum.Primary} />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-muted uppercase tracking-wider">{t.gameRunning}</div>
          <div className="text-lg font-bold text-text truncate">{t[gameNameKey(game.id)]}</div>
        </div>
        <GButton
          variant={ButtonVariantEnum.Primary}
          size={SizeEnum.sm}
          className="whitespace-nowrap"
          onClick={() => router.push(`/games/${gamePath}`)}>
          <GIcon icon={Gamepad2} size={SizeEnum.sm} />
          <span>{t.returnToGame}</span>
          <GIcon icon={ArrowRight} size={SizeEnum.sm} flip />
        </GButton>
      </GCard>
    </div>
  );
}

export { ActiveGameBanner };
