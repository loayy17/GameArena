"use client";

import clsx from "clsx";
import type { GIconProps } from "./def/GIcon";

const iconSize: Record<string, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
  "3xl": "h-12 w-12",
  "4xl": "h-16 w-16",
};

const tileSizeMap: Record<string, string> = {
  xs: "h-6 w-6",
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const tileIconSizeMap: Record<string, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const tileRoundedMap: Record<string, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-full",
};

const colors: Record<string, string> = {
  primary: "text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  inherit: "",
  "on-primary": "text-on-primary",
  accent: "text-accent",
};

function getTileGradient(gradient?: string): string {
  if (!gradient) return "bg-primary";
  if (gradient.startsWith("bg-") || gradient.startsWith("from-")) return gradient;
  if (gradient.startsWith("text-")) return `bg-${gradient.slice(5)}`;
  return `bg-${gradient}`;
}

function getTileIconColor(color?: string): string {
  if (!color) return "text-on-primary";
  if (color === "inherit") return "text-on-primary";
  return colors[color] ?? "text-on-primary";
}

function GIcon({
  icon: Icon,
  size = "md",
  color = "inherit",
  flip = true,
  className,
  onClick,
  tile = false,
  tileSize = "md",
  tileRounded: tileRoundedProp = "md",
  tileGradient = "bg-primary",
  tileColor,
  tileClassName,
}: GIconProps) {
  if (!tile) {
    const iconClassName = clsx(
      "shrink-0",
      iconSize[size],
      colors[color] ?? color,
      flip && "[dir=\"rtl\"]:scale-x-[-1]",
      onClick && "cursor-pointer",
      className,
    );
    return onClick ? (
      <button type="button" onClick={onClick} className="inline-flex bg-transparent border-0 p-0 cursor-pointer">
        <Icon className={iconClassName} aria-hidden="true" />
      </button>
    ) : (
      <Icon className={iconClassName} aria-hidden="true" />
    );
  }

  const tileClassNameMerged = clsx(
    "inline-flex items-center justify-center shrink-0",
    tileSizeMap[tileSize],
    tileRoundedMap[tileRoundedProp],
    getTileGradient(tileGradient),
    onClick && "cursor-pointer transition-colors",
    tileClassName,
  );

  const iconEl = (
    <Icon
      className={clsx(
        tileIconSizeMap[tileSize],
        getTileIconColor(tileColor),
        flip && "[dir=\"rtl\"]:scale-x-[-1]",
      )}
      aria-hidden="true"
    />
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={tileClassNameMerged} aria-label="">
        {iconEl}
      </button>
    );
  }

  return (
    <div className={tileClassNameMerged} role="img" aria-label="">
      {iconEl}
    </div>
  );
}

export { GIcon };