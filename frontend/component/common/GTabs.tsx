"use client";

import clsx from "clsx";
import { GButton } from "./GButton";
import { GBadge } from "./GBadge";
import { GNav, GNavItem } from "./GNav";
import { GTabItem, GTabsProps } from "./def/GTabs";
import { buttonSize, focusRing, navIndicator, rounded, transition } from "./tokens";
import type { GNavIndicator } from "./tokens";

function getListClassName(
  direction: "H" | "V",
  variant: GTabsProps<string | number>["variant"],
  fullWidth?: boolean,
  className?: string,
) {
  return clsx(
    "flex",
    direction === "V" ? "flex-col gap-1" : "flex-row flex-wrap gap-2",
    (variant === "underline" || variant === "default") &&
      direction === "H" &&
      "border-b border-border",
    fullWidth && direction === "H" && "w-full",
    className,
  );
}

function tabIndicator(variant: GTabsProps<string | number>["variant"]): GNavIndicator {
  if (variant === "underline") return "bottom";
  if (variant === "sidebar") return "start";
  return "none";
}

function getTabClassName<T extends string | number>(
  active: boolean,
  direction: "H" | "V",
  variant: GTabsProps<T>["variant"],
  fullWidth?: boolean,
  tabClassName?: string,
) {
  const base = clsx(
    "flex items-center gap-2 font-medium text-sm min-w-0",
    transition,
    fullWidth && (direction === "H" ? "flex-1 justify-center" : "w-full"),
    tabClassName,
  );

  const indicator = tabIndicator(variant);

  if (variant === "sidebar") {
    return clsx(
      base,
      rounded.md,
      active ? "bg-primary-muted text-primary" : "text-text-secondary hover:bg-surface-alt hover:text-text",
      indicator !== "none" &&
        (active ? navIndicator[indicator].active : navIndicator[indicator].idle),
    );
  }

  if (variant === "underline") {
    return clsx(
      base,
      "px-3 py-2",
      active ? "text-primary" : "text-text-secondary hover:text-text",
      active ? navIndicator.bottom.active : navIndicator.bottom.idle,
    );
  }

  if (variant === "pills") {
    return clsx(
      base,
      "px-4 py-2",
      rounded.md,
      active
        ? "bg-primary text-on-primary"
        : "text-text-secondary hover:bg-primary-muted",
    );
  }

  return clsx(
    base,
    "px-3 py-2",
    rounded.sm,
    active
      ? "bg-primary text-on-primary"
      : "text-text-secondary hover:bg-primary-muted",
  );
}

function GTabs<T extends string | number>({
  tabs,
  value,
  onChange,
  renderLabel,
  renderIcon,
  renderBadge,
  direction = "H",
  variant = direction === "V" ? "sidebar" : "default",
  indicator,
  className,
  tabClassName,
  fullWidth,
  children,
}: GTabsProps<T>) {
  const resolvedIndicator = indicator ?? tabIndicator(variant);

  if (variant === "sidebar" && direction === "V") {
    return (
      <div className={fullWidth ? "w-full" : undefined}>
        <GNav orientation="vertical" className={className}>
          {tabs.map((tab) => {
            const active = value === tab.id;
            return (
              <GNavItem
                key={String(tab.id)}
                role="tab"
                id={`tab-${String(tab.id)}`}
                aria-selected={active}
                aria-controls={`tabpanel-${String(tab.id)}`}
                tabIndex={active ? 0 : -1}
                disabled={tab.disabled}
                active={active}
                indicator={resolvedIndicator}
                onClick={() => onChange(tab.id)}
                icon={
                  renderIcon !== undefined ? renderIcon(tab, active) : tab.icon
                }
                label={
                  renderLabel !== undefined ? renderLabel(tab, active) : tab.label
                }
                badge={
                  renderBadge !== undefined
                    ? renderBadge(tab, active)
                    : tab.badge != null && tab.badge > 0
                      ? (
                        <GBadge size="sm" className="ms-auto min-w-5 justify-center">
                          {tab.badge}
                        </GBadge>
                      )
                      : undefined
                }
                className={tabClassName}
              />
            );
          })}
        </GNav>
        {children ? (
          <div
            role="tabpanel"
            id={`tabpanel-${String(value)}`}
            aria-labelledby={`tab-${String(value)}`}
            className="pt-4"
          >
            {children}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={fullWidth && direction === "V" ? "w-full" : undefined}>
      <div
        role="tablist"
        aria-orientation={direction === "V" ? "vertical" : "horizontal"}
        className={getListClassName(direction, variant, fullWidth, className)}
      >
        {tabs.map((tab) => {
          const active = value === tab.id;
          const labelContent =
            renderLabel !== undefined ? renderLabel(tab, active) : tab.label;
          const iconContent =
            renderIcon !== undefined ? renderIcon(tab, active) : tab.icon;
          const badgeContent =
            renderBadge !== undefined
              ? renderBadge(tab, active)
              : tab.badge != null && tab.badge > 0
                ? (
                  <GBadge size="sm" className="ms-auto min-w-5 justify-center">
                    {tab.badge}
                  </GBadge>
                )
                : null;

          return (
            <GButton
              key={String(tab.id)}
              role="tab"
              id={`tab-${String(tab.id)}`}
              aria-selected={active}
              aria-controls={`tabpanel-${String(tab.id)}`}
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              variant="ghost"
              size="sm"
              className={clsx(
                buttonSize.sm,
                focusRing,
                getTabClassName(active, direction, variant, fullWidth, tabClassName),
              )}
            >
              {iconContent}
              {labelContent}
              {badgeContent}
            </GButton>
          );
        })}
      </div>

      {children ? (
        <div
          role="tabpanel"
          id={`tabpanel-${String(value)}`}
          aria-labelledby={`tab-${String(value)}`}
          className="pt-4"
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

export { GTabs };
