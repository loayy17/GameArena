"use client";

import dynamic from "next/dynamic";
import clsx from "clsx";
import type { AnimationProps } from "./def/Animation";

const LottiePlayer = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

const sizeMap: Record<NonNullable<AnimationProps["size"]>, string> = {
  sm: "w-16 h-16",
  md: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-40 h-40",
};

function Animation({ src, className, size = "md" }: AnimationProps) {
  return (
    <div className={clsx(sizeMap[size], className)}>
      <LottiePlayer autoplay loop src={src} className="w-full h-full" />
    </div>
  );
}

export { Animation };
