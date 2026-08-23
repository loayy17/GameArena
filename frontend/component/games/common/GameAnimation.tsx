"use client";

import dynamic from "next/dynamic";

const LottiePlayer = dynamic(() => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player), { ssr: false });

function GameAnimation({ src, className }: { src: string; className?: string }) {
  return <LottiePlayer autoplay loop src={src} className={className} style={{ animationPlayState: "running" }} />;
}

export { GameAnimation };
