"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import type { IGameCardProps } from "./def/GameCard";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

const LottiePlayer = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), { ssr: false });

function GameCard({ name, desc, onClick, playLabel, animation }: IGameCardProps) {
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

  return (
    <GCard padding={SizeEnum.lg} className="flex flex-col items-center gap-4">
      <LottiePlayer
        autoplay={!reducedMotion}
        loop={!reducedMotion}
        src={animation}
        className="w-32 h-32"
        style={{ animationPlayState: reducedMotion ? "paused" : "running" }}
      />
      <div className="flex flex-1 flex-col">
        <h3 className="text-xl font-bold text-text text-center">{name}</h3>
        <p className="my-2 text-sm text-text-secondary text-center flex-1">{desc}</p>
        <GButton variant={ButtonVariantEnum.Primary} size={SizeEnum.sm} onClick={onClick}>
          {playLabel}
        </GButton>
      </div>
    </GCard>
  );
}

export { GameCard };
