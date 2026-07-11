"use client";

import clsx from "clsx";
import type { GSkeletonProps } from "./def/GSkeleton";

function GSkeleton({ variant = "text", width, height, className }: GSkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-surface",
        variant === "circle" && "rounded-full",
        variant === "rect" && "rounded-[var(--radius-md)]",
        variant === "text" && "h-4 rounded-sm",
        className,
      )}
      style={{ width, height }}
    />
  );
}

export { GSkeleton };
