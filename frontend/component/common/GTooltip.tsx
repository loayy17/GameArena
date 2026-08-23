"use client";

import { cn } from "@/lib/cn";
import type { IGTooltipProps } from "./def/GTooltip";

const sideClasses: Record<NonNullable<IGTooltipProps["side"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
  left: "right-full top-1/2 -translate-y-1/2 me-1.5",
  right: "left-full top-1/2 -translate-y-1/2 ms-1.5",
};

const arrowSideClasses: Record<NonNullable<IGTooltipProps["side"]>, string> = {
  top: "top-full left-1/2 -translate-x-1/2 -mt-1",
  bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
  left: "left-full top-1/2 -translate-y-1/2 -ms-1",
  right: "right-full top-1/2 -translate-y-1/2 -me-1",
};

function GTooltip({ content, side = "top", children, className }: IGTooltipProps) {
  if (!content) return <>{children}</>;

  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-30 whitespace-nowrap rounded bg-text px-2 py-1 text-xs font-normal text-bg opacity-0 shadow-md transition-all group-hover:opacity-100 group-focus-visible:opacity-100 group-hover:scale-100 scale-90",
          sideClasses[side],
        )}>
        {content}
        <span className={cn("absolute size-1.5 rotate-45 bg-text", arrowSideClasses[side])} aria-hidden />
      </span>
    </span>
  );
}

export { GTooltip };
