"use client";

import { cn } from "@/lib/cn";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GButton } from "./GButton";

import type { IGNavItem, IGNavProps } from "./def/GNav";

const navItem = {
  idle: "text-text-secondary hover:bg-surface-hover hover:text-text",
  active: "bg-primary-muted text-primary ring-1 ring-inset ring-primary/15 font-semibold hover:bg-primary-muted hover:text-primary",
  activeStacked: "text-primary font-semibold hover:bg-transparent hover:text-primary",
};

function GNav({ items, orientation = NavOrientationEnum.Vertical, collapsed = false, stacked = false, className, ...props }: IGNavProps) {
  const isVertical = orientation === NavOrientationEnum.Vertical;

  const renderItem = (item: IGNavItem) => {
    const active = Boolean(item.active);
    return (
      <GButton
        key={item.id}
        variant={ButtonVariantEnum.Subtle}
        size={SizeEnum.None}
        aria-current={active ? "page" : undefined}
        title={collapsed && item.label ? String(item.label) : undefined}
        tooltipPosition={collapsed ? (isVertical ? "end" : "top") : undefined}
        onClick={item.onClick}
        href={item.href}
        className={cn(
          "w-full justify-start relative min-h-11 min-w-0 gap-3 rounded-none p-0 font-medium",
          stacked ? "flex-1 flex-col justify-center gap-1 px-1 py-2 text-2xs" : cn("h-11 px-3 py-0 text-start text-sm", isVertical && "w-full"),
          active ? (stacked ? navItem.activeStacked : navItem.active) : navItem.idle,
          collapsed && "justify-center px-2",
        )}>
        {active && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute rounded-full bg-primary",
              isVertical ? "start-0.5 top-1/2 h-6 w-1 -translate-y-1/2" : "bottom-0.5 left-1/2 h-1 w-6 -translate-x-1/2",
            )}
          />
        )}
        {item.icon && (
          <span className={cn("relative inline-flex size-5 shrink-0 items-center justify-center", collapsed && !stacked && "mx-auto")}>
            {item.icon}
            {(collapsed || stacked) && item.badge && (
              <span className="absolute -top-2 -end-2 rounded-full ring-2 ring-bg-sidebar">{item.badge}</span>
            )}
          </span>
        )}
        {!collapsed && item.label && <span className={cn("min-w-0 truncate leading-snug", !stacked && "flex-1")}>{item.label}</span>}
        {!collapsed && !stacked && item.badge}
      </GButton>
    );
  };

  return (
    <nav {...props} className={cn("flex gap-1", stacked || !isVertical ? "flex-row" : "flex-col", className)}>
      {items.map(renderItem)}
    </nav>
  );
}

export { GNav };
