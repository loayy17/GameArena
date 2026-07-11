"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import type { GNavIndicator, GNavItemProps, GNavProps } from "./def/GNav";

const navBase = {
  item: "relative flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium min-w-0",
  itemIdle: "text-text-secondary hover:bg-primary-muted hover:text-text",
  itemActive: "bg-primary-muted text-primary font-semibold",
};

const navIndicator: Record<GNavIndicator, { active: string; idle: string }> = {
  start: {
    active: "border-s-[3px] border-s-primary",
    idle: "border-s-[3px] border-s-transparent",
  },
  end: {
    active: "border-e-[3px] border-e-primary",
    idle: "border-e-[3px] border-e-transparent",
  },
  top: {
    active: "border-t-[3px] border-t-primary",
    idle: "border-t-[3px] border-t-transparent",
  },
  bottom: {
    active: "border-b-[3px] border-b-primary",
    idle: "border-b-[3px] border-b-transparent",
  },
  none: { active: "", idle: "" },
};

function getIndicatorClass(active: boolean, indicator: GNavIndicator) {
  if (indicator === "none") return "";
  return active ? navIndicator[indicator].active : navIndicator[indicator].idle;
}

const GNavItem = forwardRef<HTMLButtonElement, GNavItemProps>(
  ({ active = false, indicator = "start", icon, label, badge, collapsed = false, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          navBase.item,
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
          getIndicatorClass(active, indicator),
          active ? navBase.itemActive : navBase.itemIdle,
          collapsed && "justify-center px-2",
          className,
        )}
        aria-current={active ? "page" : undefined}
        {...props}>
        {children ?? (
          <>
            {icon && (
              <span className={clsx("relative shrink-0", collapsed && "mx-auto")} title={collapsed && label ? String(label) : undefined}>
                {icon}
              </span>
            )}
            {!collapsed && label && <span className="min-w-0 flex-1 text-start leading-snug whitespace-normal">{label}</span>}
            {!collapsed && badge}
            {collapsed && badge}
          </>
        )}
      </button>
    );
  },
);

GNavItem.displayName = "GNavItem";

function GNav({ children, className, orientation = "vertical" }: GNavProps) {
  return <nav className={clsx("flex", orientation === "vertical" ? "flex-col gap-1" : "flex-row flex-wrap gap-2", className)}>{children}</nav>;
}

export { GNav, GNavItem };
