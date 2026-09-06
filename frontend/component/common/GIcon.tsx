"use client";

import { cn } from "@/lib/cn";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { accentTile, iconSize, radiusSize, tilePadding } from "@/domain/constant/style-tokens";

import type { IGIconProps } from "./def/GIcon";

function GIcon({
  icon: Icon,
  variant = "inline",
  size = SizeEnum.md,
  color = AccentColorEnum.Inherit,
  flip = false,
  gradient,
  tone,
  rounded = SizeEnum.md,
  className,
}: IGIconProps) {
  const iconEl = (
    <span aria-hidden="true" className={cn("inline-flex shrink-0", iconSize[size], color, flip && "rtl:scale-x-[-1]", variant === "inline" && className)}>
      <Icon strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-full" />
    </span>
  );

  if (variant === "tile") {
    return (
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center justify-center",
          gradient ? cn("bg-gradient-to-br text-on-primary", gradient) : cn(tone ? accentTile[tone] : "bg-primary text-on-primary", color),
          tilePadding[size],
          radiusSize[rounded],
          className,
        )}>
        {iconEl}
      </div>
    );
  }

  return iconEl;
}

export { GIcon };
