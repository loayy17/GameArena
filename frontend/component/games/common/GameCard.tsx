"use client";

import { useRouter } from "next/navigation";

import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

import { GameAnimation } from "./GameAnimation";

import type { IGameCardProps } from "./def/GameCard";

function GameCard({ name, desc, path, playLabel, animation, compact = false, onPlay }: IGameCardProps) {
  const router = useRouter();

  const handlePlay = () => {
    if (onPlay) return onPlay();
    if (path) router.push(path);
  };

  if (compact) {
    return (
      <GCard className="flex items-center gap-3 p-3 sm:p-4">
        <GameAnimation src={animation} className="size-20 shrink-0" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold tracking-tight text-text">{name}</h3>
          <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-text-secondary">{desc}</p>
        </div>
        <GButton variant={ButtonVariantEnum.Primary} size={SizeEnum.sm} onClick={handlePlay} className="shrink-0">
          {playLabel}
        </GButton>
      </GCard>
    );
  }

  return (
    <GCard className="flex flex-col overflow-hidden">
      <div className="flex w-full items-center justify-center py-8">
        <GameAnimation src={animation} className="size-36" />
      </div>
      <div className="flex flex-1 flex-col w-full px-5 pb-5">
        <h3 className="text-lg font-bold text-text tracking-tight">{name}</h3>
        <p className="mt-1 text-sm text-text-secondary leading-relaxed">{desc}</p>
        <div className="mt-auto pt-4">
          <GButton variant={ButtonVariantEnum.Primary} size={SizeEnum.sm} onClick={handlePlay} className="w-full">
            {playLabel}
          </GButton>
        </div>
      </div>
    </GCard>
  );
}

export { GameCard };
