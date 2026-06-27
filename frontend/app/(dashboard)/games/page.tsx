"use client";
import { Gamepad2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/Hooks/useTranslation";
import { ar } from "./i18n/ar.i18n";
import { en, type TGamesTranslation } from "./i18n/en.i18n";

function GamesPage() {
  const t = useTranslation({ en, ar }) as TGamesTranslation;

  const gameList = [
    {
      name: t.ticTacToe,
      path: "/tic-tac-toe",
      desc: t.ticTacToeDesc,
      color: "from-cyan-400 via-neon-blue to-cyan-300",
    },
    {
      name: t.snake,
      path: "/snake",
      desc: t.snakeDesc,
      color: "from-emerald-400 via-neon-green to-emerald-300",
    },
    {
      name: t.pong,
      path: "/pong",
      desc: t.pongDesc,
      color: "from-violet-400 via-neon-purple to-violet-300",
    },
  ];

  return (
    <div className="flex items-center justify-center h-full relative z-10 px-8">
      <div className="text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-primary via-neon-cyan to-neon-cyan flex items-center justify-center">
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-white">
          {t.title}
        </h1>
        <p className="text-text-secondary text-sm mb-8">{t.subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {gameList.map((g) => (
            <Link
              key={g.name}
              href={g.path}
              className="group block bg-bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-lg font-bold text-white mb-1">{g.name}</h3>
              <p className="text-xs text-text-secondary mb-4">{g.desc}</p>
              <div
                className={`inline-flex items-center gap-1.5 text-xs font-bold bg-linear-to-r ${g.color} bg-clip-text text-transparent`}
              >
                {t.play} <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
export { GamesPage };
