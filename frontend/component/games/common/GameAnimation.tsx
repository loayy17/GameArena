"use client";

import dynamic from "next/dynamic";

import type { IGameAnimationProps } from "./def/GameAnimation";

const LottiePlayer = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), { ssr: false });

function GameAnimation({ src, className }: IGameAnimationProps) {
  return <LottiePlayer autoplay loop src={src} className={className} />;
}

export { GameAnimation };
