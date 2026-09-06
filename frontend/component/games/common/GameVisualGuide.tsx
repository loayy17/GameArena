"use client";

import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronsUpDown } from "lucide-react";

import { GIcon } from "@/component/common/GIcon";
import { cn } from "@/lib/cn";
import { RPS_CHOICE_EMOJI, RPS_CHOICES } from "@/domain/constant/games";
import { GamesKindEnum } from "@/domain/enum/GamesKindEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { ReactNode } from "react";
import type { IGameVisualGuideProps } from "./def/GameVisualGuide";

const keyChip = "flex items-center justify-center size-7 rounded-md bg-surface border border-border-light text-text-secondary";

function TicTacToeVisual() {
  const marks = ["X", "", "O", "", "X", "", "O", "", "X"];
  return (
    <div className="grid grid-cols-3 gap-1" aria-hidden>
      {marks.map((mark, i) => (
        <span key={i} className="flex items-center justify-center size-7 rounded-md bg-surface border border-border-light text-xs font-extrabold">
          {mark === "X" && <span className="text-primary">X</span>}
          {mark === "O" && <span className="text-accent">O</span>}
        </span>
      ))}
    </div>
  );
}

function SnakeVisual() {
  return (
    <div className="flex items-center gap-2" aria-hidden>
      <div className="grid grid-cols-3 gap-1">
        <span />
        <span className={keyChip}>
          <GIcon icon={ArrowUp} size={SizeEnum.sm} />
        </span>
        <span />
        <span className={keyChip}>
          <GIcon icon={ArrowLeft} size={SizeEnum.sm} />
        </span>
        <span className={keyChip}>
          <GIcon icon={ArrowDown} size={SizeEnum.sm} />
        </span>
        <span className={keyChip}>
          <GIcon icon={ArrowRight} size={SizeEnum.sm} />
        </span>
      </div>
      <span className="size-3 rounded-full bg-warning" />
    </div>
  );
}

function PingPongVisual() {
  return (
    <div className="relative w-24 h-16 rounded-lg border border-border-light bg-game-board overflow-hidden" aria-hidden>
      <span className="absolute start-1 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded bg-accent" />
      <span className="absolute start-4 top-1/2 -translate-y-1/2 text-text-muted">
        <GIcon icon={ChevronsUpDown} size={SizeEnum.sm} />
      </span>
      <span className="absolute end-6 top-1/3 size-2 rounded-full bg-primary" />
      <span className="absolute end-1 top-1/2 -translate-y-1/2 w-1.5 h-7 rounded bg-warning" />
    </div>
  );
}

function RockPaperScissorsVisual() {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {RPS_CHOICES.map((choice) => (
        <span key={choice} className="flex items-center justify-center size-9 rounded-md bg-surface border border-border-light text-lg">
          {RPS_CHOICE_EMOJI[choice]}
        </span>
      ))}
    </div>
  );
}

function ConnectFourVisual() {
  return (
    <div className="flex flex-col items-center gap-1" aria-hidden>
      <div className="grid grid-cols-4 gap-1">
        <span className="flex justify-center text-warning">
          <GIcon icon={ArrowDown} size={SizeEnum.sm} />
        </span>
        <span />
        <span />
        <span />
        {["bg-accent", "bg-surface", "bg-surface", "bg-surface", "bg-warning", "bg-accent", "bg-surface", "bg-surface"].map((fill, i) => (
          <span key={i} className={cn("size-5 rounded-full border border-border-light", fill)} />
        ))}
      </div>
    </div>
  );
}

const visuals: Record<GamesKindEnum, () => ReactNode> = {
  [GamesKindEnum.TicTacToe]: TicTacToeVisual,
  [GamesKindEnum.Snake]: SnakeVisual,
  [GamesKindEnum.PingPong]: PingPongVisual,
  [GamesKindEnum.RockPaperScissors]: RockPaperScissorsVisual,
  [GamesKindEnum.ConnectFour]: ConnectFourVisual,
};

function GameVisualGuide({ gameType, guide }: IGameVisualGuideProps) {
  const Visual = visuals[gameType];
  if (!Visual || !guide) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="shrink-0 p-2 rounded-lg bg-bg-elevated border border-border/60">
        <Visual />
      </div>
      <p className="text-sm font-medium text-text">{guide}</p>
    </div>
  );
}

export { GameVisualGuide };
