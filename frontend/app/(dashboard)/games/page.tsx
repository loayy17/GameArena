"use client";
import { Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TGamesTranslation } from "./i18n/en.i18n";
import { GCard } from "@/component/common/GCard";
import { GIconTile } from "@/component/common/GIconTile";
import { GIcon } from "@/component/common/GIcon";
import type { GGradient } from "@/component/common/tokens";

function GamesPage() {
  const t = useTranslation({ en, ar }) as TGamesTranslation;

  const gameList: {
    name: string;
    path: string;
    desc: string;
    gradient: GGradient;
    playGradient: GGradient;
  }[] = [
    {
      name: t.ticTacToe,
      path: "/tic-tac-toe",
      desc: t.ticTacToeDesc,
      gradient: "game-cyan",
      playGradient: "play-cyan",
    },
    {
      name: t.snake,
      path: "/snake",
      desc: t.snakeDesc,
      gradient: "game-green",
      playGradient: "play-green",
    },
    {
      name: t.pong,
      path: "/pong",
      desc: t.pongDesc,
      gradient: "game-magenta",
      playGradient: "play-magenta",
    },
  ];

  return (
    <div className="flex items-center justify-center h-full relative z-10 px-8">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <GIconTile gradient="game-cyan" size="lg">
            <GIcon icon={Gamepad2} size="lg" color="inherit" className="text-text" />
          </GIconTile>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-text">
          {t.title}
        </h1>
        <p className="text-text-secondary text-sm mb-8">{t.subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gameList.map((g) => (
            <Link key={g.name} href={g.path}>
              <GCard variant="interactive" padding="lg" className="text-start h-full">
                <h3 className="text-lg font-bold text-text mb-1">{g.name}</h3>
                <p className="text-xs text-text-secondary mb-4">{g.desc}</p>
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${g.playGradient}`}>
                  {t.play} <GIcon icon={ArrowRight} size="xs" color="inherit" />
                </span>
              </GCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export default GamesPage;
