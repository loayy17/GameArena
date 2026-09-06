"use client";

import { useId } from "react";

import { cn } from "@/lib/cn";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GBadge } from "./GBadge";
import { GButton } from "./GButton";

import type { KeyboardEvent } from "react";
import type { IGTabItem, IGTabsProps } from "./def/GTabs";

function GTabs<T extends string | number>({ tabs, value, onChange, responsive = true, className, tabClassName, panelId, children }: IGTabsProps<T>) {
  const baseId = useId();

  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, tab: IGTabItem<T>) => {
    const selectable = tabs.filter((t) => !t.disabled);
    if (!selectable.length) return;
    const currentIndex = selectable.findIndex((t) => t.id === tab.id);
    let nextIndex = currentIndex;
    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % selectable.length;
        break;
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + selectable.length) % selectable.length;
        break;
      case "Home":
        nextIndex = 0;
        break;
      case "End":
        nextIndex = selectable.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    document.getElementById(`${baseId}-tab-${selectable[nextIndex].id}`)?.focus();
  };

  const activeTab = tabs.find((tab) => tab.id === value);

  return (
    <div className={cn(responsive && "w-full mb-3", className)}>
      <div
        role="tablist"
        aria-orientation="horizontal"
        className={cn("flex overflow-hidden rounded-xl border border-border/60 bg-surface/50 shadow-md", responsive && "flex-col md:flex-row md:flex-wrap")}>
        {tabs.map((tab) => {
          const active = value === tab.id;
          return (
            <GButton
              key={tab.id}
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              aria-selected={active}
              aria-controls={children ? `${baseId}-panel-${tab.id}` : panelId}
              tabIndex={active ? 0 : -1}
              variant={active ? ButtonVariantEnum.Primary : ButtonVariantEnum.Subtle}
              disabled={tab.disabled}
              onKeyDown={(event) => moveFocus(event, tab)}
              onClick={() => onChange(tab.id)}
              className={cn("rounded-none", tabClassName)}>
              {tab.icon}
              <span
                className={cn(
                  "min-w-0 truncate leading-snug",
                  responsive ? "flex-1 whitespace-normal text-start md:flex-none md:text-center" : "whitespace-nowrap",
                )}>
                {tab.label}
              </span>
              {tab.badge != null && (
                <GBadge count={tab.badge} variant={tab.badgeTone ?? AccentColorEnum.Primary} size={SizeEnum.sm} className={cn("ms-auto", active && "bg-on-primary text-primary")} />
              )}
            </GButton>
          );
        })}
      </div>

      {children && activeTab && (
        <div role="tabpanel" id={`${baseId}-panel-${value}`} aria-labelledby={`${baseId}-tab-${value}`} tabIndex={0} className="pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

export { GTabs };
