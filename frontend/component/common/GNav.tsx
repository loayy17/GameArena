"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import type { GNavIndicator, GNavItemProps, GNavProps } from "./def/GNav";
import { focusRing, navBase, navIndicator, rounded, transition } from "./tokens";

function getIndicatorClass(active: boolean, indicator: GNavIndicator) {
  if (indicator === "none") return "";
  return active ? navIndicator[indicator].active : navIndicator[indicator].idle;
}

const GNavItem = forwardRef<HTMLButtonElement, GNavItemProps>(
  (
    {
      active = false,
      indicator = "start",
      icon,
      label,
      badge,
      collapsed = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          navBase.item,
          rounded.md,
          transition,
          focusRing,
          getIndicatorClass(active, indicator),
          active ? navBase.itemActive : navBase.itemIdle,
          collapsed && "justify-center px-2",
          className,
        )}
        aria-current={active ? "page" : undefined}
        {...props}
      >
        {children ?? (
          <>
            {icon && (
              <span
                className={clsx("relative shrink-0", collapsed && "mx-auto")}
                title={collapsed && label ? String(label) : undefined}
              >
                {icon}
              </span>
            )}
            {!collapsed && label && (
              <span className="min-w-0 flex-1 text-start leading-snug whitespace-normal">
                {label}
              </span>
            )}
            {!collapsed && badge}
            {collapsed && badge}
          </>
        )}
      </button>
    );
  },
);

GNavItem.displayName = "GNavItem";

function GNav({
  children,
  className,
  orientation = "vertical",
}: GNavProps) {
  return (
    <nav
      className={clsx(
        "flex",
        orientation === "vertical" ? "flex-col gap-1" : "flex-row flex-wrap gap-2",
        className,
      )}
    >
      {children}
    </nav>
  );
}

export { GNav, GNavItem };
