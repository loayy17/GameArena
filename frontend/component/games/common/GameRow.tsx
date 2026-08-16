"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { translateGameInfo } from "@/domain/constant/games";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import type { IGameRowProps } from "./def/GameRow";

const LottiePlayer = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), { ssr: false });

function GameRow({ game, gt, onClick, playLabel }: IGameRowProps) {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const { name, description, instruction } = translateGameInfo(gt, game.type);

  return (
    <GCard padding={SizeEnum.md} className="flex items-center gap-4">
      <LottiePlayer
        autoplay={!reducedMotion}
        loop={!reducedMotion}
        src={game.animation}
        className="w-12 h-12 shrink-0"
        style={{ animationPlayState: reducedMotion ? "paused" : "running" }}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold text-text truncate">{name}</h3>
        <p className="text-sm text-text-secondary truncate">{description}</p>
        <p className="text-xs text-text-muted truncate flex items-center gap-1.5">
          <GIcon icon={BookOpen} size={SizeEnum.xs} />
          {instruction}
        </p>
      </div>
      <GButton variant={ButtonVariantEnum.Primary} size={SizeEnum.sm} className="shrink-0" onClick={onClick}>
        {playLabel}
      </GButton>
    </GCard>
  );
}

export { GameRow };
