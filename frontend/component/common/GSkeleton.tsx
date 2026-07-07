"use client";

import clsx from "clsx";
import type { GSkeletonProps } from "./def/GSkeleton";
import { rounded } from "./tokens";

function GSkeleton({ variant = "text", width, height, className }: GSkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-surface-alt",
        variant === "circle" && rounded.full,
        variant === "rect" && rounded.md,
        variant === "text" && "h-4 rounded-sm",
        className,
      )}
      style={{ width, height }}
    />
  );
}

export { GSkeleton };
