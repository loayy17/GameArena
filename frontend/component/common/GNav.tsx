"use client";

import { cn } from "@/lib/cn";
import { forwardRef } from "react";
import { GTooltip } from "./GTooltip";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import type { IGNavProps } from "./def/GNav";

const navBase = {
  itemIdle: "text-text-secondary hover:bg-surface-hover hover:text-text",
  itemActive: "bg-primary-muted text-primary font-semibold",
};

const GNav = forwardRef<HTMLDivElement, IGNavProps>(
  ({ items, orientation = NavOrientationEnum.Vertical, collapsed = false, stacked = false, className, ...props }, ref) => {
    const isVertical = orientation === NavOrientationEnum.Vertical;

    return (
      <div ref={ref} className={cn("flex", stacked ? "flex-row gap-1" : isVertical ? "flex-col gap-1" : "flex-row gap-1", className)}>
        {items.map((item) => {
          const active = Boolean(item.active);
          const buttonEl = (
            <button
              key={item.id}
              type="button"
              disabled={item.disabled}
              className={cn(
                stacked
                  ? "relative flex-1 flex flex-col items-center justify-center gap-1 px-1 py-2 min-h-11 min-w-0 text-2xs rounded-xl"
                  : cn("flex items-center gap-3 px-3 h-11 text-sm min-w-0", isVertical ? "w-full" : "shrink-0"),
                "relative font-medium text-start cursor-pointer disabled:cursor-not-allowed",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                "transition-colors",
                active ? navBase.itemActive : navBase.itemIdle,
                collapsed && "justify-center px-2",
              )}
              aria-current={active ? "page" : undefined}
              onClick={item.onClick}
              {...props}>
              {active && !stacked && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute rounded-full bg-primary",
                    isVertical ? "start-0.5 top-1/2 -translate-y-1/2 h-6 w-1" : "top-0.5 left-1/2 -translate-x-1/2 w-6 h-1",
                  )}
                />
              )}
              {item.icon && (
                <span
                  className={cn("relative inline-flex items-center justify-center shrink-0", stacked ? "size-6" : "size-5", collapsed && "mx-auto")}>
                  {item.icon}
                  {collapsed && item.badge && (
                    <span aria-hidden className="absolute -top-0.5 -end-0.5 size-2.5 rounded-full bg-danger border-2 border-bg-sidebar" />
                  )}
                  {stacked && item.badge && <span className="absolute -top-1.5 -end-2">{item.badge}</span>}
                </span>
              )}
              {!collapsed && item.label && <span className="min-w-0 truncate leading-snug">{item.label}</span>}
              {!collapsed && !stacked && item.badge && <span className="ms-auto shrink-0">{item.badge}</span>}
            </button>
          );
          if (collapsed && item.label) {
            return (
              <GTooltip key={item.id} content={String(item.label)} side={isVertical ? "right" : "top"}>
                {buttonEl}
              </GTooltip>
            );
          }
          return buttonEl;
        })}
      </div>
    );
  },
);

GNav.displayName = "GNav";

export { GNav };
