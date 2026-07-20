"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type GNavIndicator = "start" | "end" | "top" | "bottom" | "none";

interface GNavItem {
  id: string;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface GNavProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  items: GNavItem[];
  orientation?: "vertical" | "horizontal";
  indicator?: GNavIndicator;
  collapsed?: boolean;
  className?: string;
}

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

const GNav = forwardRef<HTMLButtonElement, GNavProps>(
  ({ items, orientation = "vertical", indicator = "start", collapsed = false, className, ...props }, ref) => {
    return (
      <nav
        className={clsx(
          "flex",
          orientation === "vertical" ? "flex-col gap-1" : "flex-row flex-wrap gap-2",
          className,
        )}>
        {items.map((item) => {
          const active = Boolean(item.active);
          return (
            <button
              key={item.id}
              ref={item.id === items[0]?.id ? ref : undefined}
              type="button"
              disabled={item.disabled}
              onClick={item.onClick}
              className={clsx(
                navBase.item,
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                getIndicatorClass(active, indicator),
                active ? navBase.itemActive : navBase.itemIdle,
                collapsed && "justify-center px-2",
              )}
              aria-current={active ? "page" : undefined}
              {...props}>
              {item.icon && (
                <span className={clsx("relative shrink-0", collapsed && "mx-auto")} title={collapsed && item.label ? String(item.label) : undefined}>
                  {item.icon}
                </span>
              )}
              {!collapsed && item.label && (
                <span className="min-w-0 flex-1 text-start leading-snug whitespace-normal">{item.label}</span>
              )}
              {!collapsed && item.badge}
              {collapsed && item.badge}
            </button>
          );
        })}
      </nav>
    );
  },
);

GNav.displayName = "GNav";

export { GNav, type GNavProps, type GNavIndicator, type GNavItem };
