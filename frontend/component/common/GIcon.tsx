"use client";

import { cn } from "@/lib/cn";
import { GTooltip } from "./GTooltip";
import type { IGIconProps } from "./def/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { accentHoverBg, accentHoverText } from "@/domain/constant/accent-bg";
import { iconSize, radiusSize } from "@/domain/constant/size-classes";

function GIcon({
  icon: Icon,
  size = SizeEnum.md,
  color = AccentColorEnum.Inherit,
  flip = false,
  className,
  onClick,
  ariaLabel,
  tile = false,
  tileRounded = SizeEnum.md,
  tileGradient = "bg-primary",
  tileColor,
  tileClassName,
  hover = false,
}: IGIconProps) {
  const sizeClass = iconSize[size];
  const isRtl = flip ? "rtl:scale-x-[-1]" : "";

  if (!tile) {
    if (onClick) {
      const btn = (
        <button
          type="button"
          onClick={onClick}
          aria-label={ariaLabel}
          className={cn(
            "inline-flex items-center justify-center bg-transparent border-0 p-0 cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
            className,
          )}>
          <Icon className={cn("shrink-0", sizeClass, color, isRtl)} aria-hidden="true" />
        </button>
      );
      return ariaLabel ? <GTooltip content={ariaLabel}>{btn}</GTooltip> : btn;
    }
    return <Icon className={cn("shrink-0", sizeClass, color, isRtl, className)} aria-hidden="true" />;
  }

  const activeColor = tileColor || AccentColorEnum.OnPrimary;
  const isGradient = tileGradient.includes("from-");
  const wrapperClasses = cn(
    "inline-flex items-center justify-center shrink-0 p-2",
    radiusSize[tileRounded],
    isGradient && "bg-gradient-to-br",
    tileGradient,
    hover && accentHoverBg[activeColor],
    onClick && "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
    tileClassName,
  );

  const iconEl = <Icon className={cn(sizeClass, activeColor, hover && accentHoverText[activeColor], isRtl)} aria-hidden="true" />;

  if (onClick) {
    const btn = (
      <button type="button" onClick={onClick} aria-label={ariaLabel} className={wrapperClasses}>
        {iconEl}
      </button>
    );
    return ariaLabel ? <GTooltip content={ariaLabel}>{btn}</GTooltip> : btn;
  }

  return <div className={wrapperClasses}>{iconEl}</div>;
}

export { GIcon };
