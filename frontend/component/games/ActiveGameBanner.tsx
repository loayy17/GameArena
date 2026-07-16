"use client";

import { ArrowRight, Gamepad2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/app/providers/GameProvider";
import { GamesList } from "@/domain/constant/games";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "../common/GCard";
import { GIconTile } from "../common/GIconTile";

function ActiveGameBanner() {
  const { state, lastGameType } = useGame();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation({
    en: { returnToGame: "Return to Game", gameRunning: "Game running", ticTacToe: "Tic Tac Toe", snake: "Snake", pong: "Pong" },
    ar: { returnToGame: "العودة إلى اللعبة", gameRunning: "اللعبة جارية", ticTacToe: "إكس أو", snake: "الثعبان", pong: "بونغ" },
  }) as {
    returnToGame: string;
    gameRunning: string;
    ticTacToe: string;
    snake: string;
    pong: string;
  };
  const isActive = state?.hasStarted === true && state?.isFinished === false;
  const isOnGamePage = pathname.startsWith("/games/") && pathname !== "/games";

  if (!isActive || isOnGamePage) return null;

  const gamePath = lastGameType !== null ? (GamesList.find((g) => g.type === (lastGameType as typeof g.type))?.path ?? "tic-tac-toe") : "tic-tac-toe";
  const game = GamesList.find((g) => g.type === (lastGameType as typeof g.type)) ?? GamesList[0];
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[50%] max-w-2xl">
      <GCard
        padding="md"
        className={`flex items-center gap-4 justify-center flex-col sm:flex-row text-white ${game.gradient.replace("text-", "bg-")}`}>
        <GIconTile icon={game.icon} size="lg" gradient={game.gradient} className="rounded-full bg-bg" />
        <div className="flex flex-col items-start text-start">
          <div className="text-lg font-bold tracking-wide">
            {t.gameRunning}: {t[game?.name as keyof typeof t]}
          </div>
          <GButton className="flex flex-col sm:flex-row items-center h-auto text-sm gap-3" onClick={() => router.push(`/games/${gamePath}`)}>
            <GIcon icon={Gamepad2} size="sm" color="inherit" className="animate-pulse" />
            <span>{t.returnToGame}</span>
            <GIcon icon={ArrowRight} />
          </GButton>
        </div>
      </GCard>
    </div>
  );
}

export { ActiveGameBanner };
