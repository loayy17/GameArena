"use client";

import dynamic from "next/dynamic";
import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { Gamepad2, Users, Zap } from "lucide-react";
import type { GameCardProps } from "./def/GameCard";
import clsx from "clsx";

const LottiePlayer = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), { ssr: false });

function GameCard({ name, desc, icon, onClick, gradientClass, playLabel, animation, page }: GameCardProps) {
  return (
    <GCard
      variant="glass"
      padding="lg"
      className={clsx(
        "group",
        "flex flex-col",
        "h-full",
        "transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        "hover:border-primary/30",
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-secondary/5 before:opacity-0 before:transition-opacity before:duration-300 group-hover:before:opacity-100",
      )}>
      {/* Preview */}
      <div
        className={clsx(
          "relative flex items-center justify-center",
          "h-36 sm:h-44",
          "rounded-xl",
          "mb-6",
          page ? "bg-bg/50" : "bg-gradient-to-br",
          page ? "" : (gradientClass ?? "from-primary to-accent"),
        )}>
        {animation ? (
          <div className="w-24 h-24">
            <LottiePlayer autoplay loop src={animation} className="w-full h-full" />
          </div>
        ) : (
          icon && (
            <GIcon
              icon={icon}
              size="xl"
              tile
              tileSize="xl"
              tileGradient={gradientClass}
              className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 drop-shadow-lg"
            />
          )
        )}
        {!page && (
          <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <GIcon
              icon={Gamepad2}
              size="sm"
              color="text"
              className="w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm flex items-center justify-center"
            />
            <GIcon icon={Users} size="sm" color="text" className="w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm flex items-center justify-center" />
            <GIcon icon={Zap} size="sm" color="text" className="w-8 h-8 rounded-full bg-bg/80 backdrop-blur-sm flex items-center justify-center" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col relative z-10">
        <h3 className="text-xl font-bold text-text text-center">{name}</h3>

        <p className="mt-2 text-sm text-text-secondary text-center flex-1">{desc}</p>

        <GButton variant="primary" onClick={onClick} className="mt-6 w-full group-hover:scale-[1.02] transition-transform duration-200">
          {playLabel}
        </GButton>
      </div>
    </GCard>
  );
}

export { GameCard };
