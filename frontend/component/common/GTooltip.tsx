"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";
import { useOverlayPosition } from "@/hooks/useOverlayPosition";

import type { IGTooltipProps } from "./def/GTooltip";
import type { TNullable } from "@/domain/type/TCommon";

const EDGE_MARGIN = 8;
const GAP = 6;
const ARROW_INSET = 12;

interface ITooltipLayout {
  left: number;
  top: number;
  arrow: number;
  resolved: "top" | "bottom" | "left" | "right";
}

function GTooltip({ content, side = "top", children, className }: IGTooltipProps) {
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const compute = useCallback<Parameters<typeof useOverlayPosition<ITooltipLayout>>[0]["compute"]>(
    (anchor, tooltip, ctx) => {
      const resolved: ITooltipLayout["resolved"] =
        side === "start" ? (ctx.rtl ? "right" : "left") : side === "end" ? (ctx.rtl ? "left" : "right") : side;

      let left: number;
      let top: number;
      if (resolved === "top" || resolved === "bottom") {
        left = anchor.left + anchor.width / 2 - tooltip.width / 2;
        top = resolved === "top" ? anchor.top - GAP - tooltip.height : anchor.bottom + GAP;
      } else {
        left = resolved === "right" ? anchor.right + GAP : anchor.left - GAP - tooltip.width;
        top = anchor.top + anchor.height / 2 - tooltip.height / 2;
      }

      const clampedLeft = Math.min(Math.max(left, EDGE_MARGIN), ctx.viewportWidth - tooltip.width - EDGE_MARGIN);
      const clampedTop = Math.min(Math.max(top, EDGE_MARGIN), ctx.viewportHeight - tooltip.height - EDGE_MARGIN);

      let arrow: number;
      if (resolved === "top" || resolved === "bottom") {
        arrow = Math.min(Math.max(anchor.left + anchor.width / 2 - clampedLeft, ARROW_INSET), tooltip.width - ARROW_INSET);
      } else {
        arrow = Math.min(Math.max(anchor.top + anchor.height / 2 - clampedTop, ARROW_INSET), tooltip.height - ARROW_INSET);
      }

      return { left: clampedLeft, top: clampedTop, arrow, resolved };
    },
    [side],
  );

  const { anchorRef, floatingRef, output } = useOverlayPosition<ITooltipLayout, HTMLSpanElement, HTMLDivElement>({ open: open && Boolean(content), compute, mode: "close" });
  const layout = output as TNullable<ITooltipLayout>;

  useEffect(() => {
    if (!open) return;
    const hideOnScroll = () => setOpen(false);
    window.addEventListener("scroll", hideOnScroll, true);
    return () => window.removeEventListener("scroll", hideOnScroll, true);
  }, [open]);

  return (
    <span
      ref={anchorRef}
      className={cn("inline-block max-w-full", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={(e) => {
        if ((e.target as HTMLElement).matches(":focus-visible")) setOpen(true);
      }}
      onBlur={() => setOpen(false)}
      aria-describedby={open && content ? tooltipId : undefined}>
      {children}
      {open &&
        content &&
        createPortal(
          <div
            ref={floatingRef}
            role="tooltip"
            id={tooltipId}
            style={{ position: "fixed", top: layout?.top ?? -9999, left: layout?.left ?? -9999 }}
            className={cn(
              "pointer-events-none z-popover max-w-xs whitespace-nowrap rounded bg-text px-2 py-1 text-xs font-normal text-bg shadow-md",
              layout ? "animate-scale-in" : "opacity-0",
            )}>
            {layout && (
              <span
                aria-hidden
                className="absolute size-2 rotate-45 bg-text"
                style={
                  layout.resolved === "top"
                    ? { bottom: "-4px", left: layout.arrow - 4 }
                    : layout.resolved === "bottom"
                      ? { top: "-4px", left: layout.arrow - 4 }
                      : layout.resolved === "right"
                        ? { left: "-4px", top: layout.arrow - 4 }
                        : { right: "-4px", top: layout.arrow - 4 }
                }
              />
            )}
            {content}
          </div>,
          document.body,
        )}
    </span>
  );
}

export { GTooltip };
