"use client";

import { ArrowRight, Gamepad2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useGame } from "@/app/providers/GameProvider";
import { GamesList } from "@/domain/constant/games";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "../common/GCard";

function slideInRightKeyframes() {
  return `@keyframes ga-slideInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}.ga-slide-in-right{animation:ga-slideInRight .3s ease-out}`;
}

function ActiveGameBanner() {
  const { state, lastGameType } = useGame();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslation({
    en: { returnToGame: "Return to Game", gameRunning: "Game Running", ticTacToe: "Tic Tac Toe", snake: "Snake", pong: "Ping Pong" },
    ar: { returnToGame: "العودة إلى اللعبة", gameRunning: "اللعبة جارية", ticTacToe: "إكس أو", snake: "الثعبان", pong: "بينغ بونغ" },
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
    <>
      <style>{slideInRightKeyframes()}</style>
      <div className="fixed bottom-6 inset-inline-4 sm:inset-inline-end-4 sm:w-96 sm:max-w-none z-50 ga-slide-in-right">
      <GCard variant="glass" padding="md" className="flex items-center gap-4 shadow-2xl">
        <div className="p-2 bg-primary/10 rounded-xl">
          <GIcon icon={game.icon} size="lg" color="primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-text-muted uppercase tracking-wider">{t.gameRunning}</div>
          <div className="text-lg font-bold text-text truncate">{t[game?.name as keyof typeof t]}</div>
        </div>
        <GButton variant="primary" size="sm" className="whitespace-nowrap" onClick={() => router.push(`/games/${gamePath}`)}>
          <GIcon icon={Gamepad2} size="sm" color="inherit" className="animate-pulse" />
          <span>{t.returnToGame}</span>
          <GIcon icon={ArrowRight} size="sm" className="rtl:-scale-x-100" />
        </GButton>
      </GCard>
    </div></>  
  );
}

export { ActiveGameBanner };
