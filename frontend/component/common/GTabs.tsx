"use client";

import clsx from "clsx";
import { GBadge } from "./GBadge";
import type { GTabsProps } from "./def/GTabs";

const variantStyles: Record<string, { tab: string; active: string; idle: string; list?: string }> = {
  pills: {
    tab: "px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium",
    active: "bg-primary text-on-primary shadow-md",
    idle: "text-text-secondary hover:bg-primary-muted hover:text-text",
  },
  underline: {
    tab: "px-3 py-2.5 text-sm font-medium border-b-2 -mb-px",
    active: "text-primary border-b-primary",
    idle: "text-text-secondary hover:text-text border-b-transparent",
    list: "border-b border-border",
  },
  sidebar: {
    tab: "px-3 py-2.5 text-sm font-medium",
    active: "bg-primary-muted text-primary font-semibold border-s-[3px] border-s-primary",
    idle: "text-text-secondary hover:bg-primary-muted hover:text-text border-s-[3px] border-s-transparent",
  },
  default: {
    tab: "px-4 py-2 rounded-[var(--radius-md)] text-sm font-medium",
    active: "bg-primary text-on-primary",
    idle: "text-text-secondary hover:bg-primary-muted hover:text-text",
  },
};

function renderTabBadge<T extends string | number>(
  tab: { badge?: number },
  renderBadge: GTabsProps<T>["renderBadge"],
  active: boolean,
): React.ReactNode {
  if (renderBadge !== undefined) return renderBadge(tab as { id: T; badge?: number }, active);
  if (tab.badge != null && tab.badge > 0) {
    return <GBadge size="sm" className="ms-auto min-w-5 justify-center">{tab.badge}</GBadge>;
  }
  return null;
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
  className,
  tabClassName,
  fullWidth,
  children,
}: GTabsProps<T>) {
  const styles = variantStyles[variant] ?? variantStyles.default;

  if (variant === "sidebar" && direction === "V") {
    return (
      <div className={fullWidth ? "w-full" : undefined}>
        <nav role="tablist" aria-orientation="vertical" className={clsx("flex flex-col gap-1", className)}>
          {tabs.map((tab) => {
            const active = value === tab.id;
            return (
              <button
                key={String(tab.id)}
                role="tab"
                id={`tab-${String(tab.id)}`}
                aria-selected={active}
                aria-controls={`tabpanel-${String(tab.id)}`}
                tabIndex={active ? 0 : -1}
                disabled={tab.disabled}
                onClick={() => onChange(tab.id)}
                className={clsx(
                  "flex items-center gap-3 min-w-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  styles.tab,
                  active ? styles.active : styles.idle,
                  tabClassName,
                )}
              >
                {renderIcon !== undefined ? renderIcon(tab, active) : tab.icon}
                <span className="min-w-0 flex-1 text-start leading-snug whitespace-normal">
                  {renderLabel !== undefined ? renderLabel(tab, active) : tab.label}
                </span>
                {renderTabBadge(tab, renderBadge, active)}
              </button>
            );
          })}
        </nav>
        {children && (
          <div role="tabpanel" id={`tabpanel-${String(value)}`} aria-labelledby={`tab-${String(value)}`} className="pt-4">
            {children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={fullWidth && direction === "V" ? "w-full" : undefined}>
      <div
        role="tablist"
        aria-orientation={direction === "V" ? "vertical" : "horizontal"}
        className={clsx(
          "flex",
          direction === "V" ? "flex-col gap-1" : "flex-row flex-wrap gap-1",
          styles.list,
          fullWidth && direction === "H" && "w-full",
          className,
        )}>
        {tabs.map((tab) => {
          const active = value === tab.id;
          return (
            <button
              key={String(tab.id)}
              role="tab"
              id={`tab-${String(tab.id)}`}
              aria-selected={active}
              aria-controls={`tabpanel-${String(tab.id)}`}
              tabIndex={active ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={clsx(
                "flex items-center gap-2 min-w-0 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                styles.tab,
                active ? styles.active : styles.idle,
                fullWidth && direction === "H" && "flex-1 justify-center",
                tabClassName,
              )}>
              {renderIcon !== undefined ? renderIcon(tab, active) : tab.icon}
              {renderLabel !== undefined ? renderLabel(tab, active) : tab.label}
              {renderTabBadge(tab, renderBadge, active)}
            </button>
          );
        })}
      </div>

      {children && (
        <div role="tabpanel" id={`tabpanel-${String(value)}`} aria-labelledby={`tab-${String(value)}`} className="pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export { GTabs };
