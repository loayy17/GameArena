"use client";

import { createContext, useContext, type ReactNode } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

import { useAside, type UseAsideReturn } from "@/hooks/useAside";
import { GBackdrop } from "./GBackdrop";
import { GButton } from "./GButton";

type AsideSide = "start" | "end";
type AsideMode = "inline" | "overlay";

interface GAsideProps {
  side: AsideSide;
  widthExpanded: string;
  /** "inline" collapses to an icon rail on desktop (default).
   *  "overlay" makes it an overlay+backdrop on every breakpoint,
   *  including desktop — rarely what you want for a primary aside. */
  mode?: AsideMode;
  defaultDesktopCollapsed?: boolean;

  /** Shown as the collapsed header button (desktop) and as the
   *  default FAB icon (compact). Embed a notification dot inside
   *  it yourself if you need one. */
  collapsedIcon: ReactNode;
  expandedBrand: ReactNode;

  children: ReactNode;
  footer?: ReactNode;

  fab?: ReactNode;
  fabClassName?: string;

  /** Accessible name for the <aside> landmark and the FAB button. */
  ariaLabel: string;
}

const AsideContext = createContext<UseAsideReturn | null>(null);

function useAsideCtx() {
  const ctx = useContext(AsideContext);
  if (!ctx) {
    throw new Error("useAsideCtx must be used inside GAside");
  }
  return ctx;
}

function sidePosition(side: AsideSide) {
  return side === "start" ? "start-0" : "end-0";
}

function hiddenTransform(side: AsideSide) {
  return side === "start" ? "ltr:-translate-x-full rtl:translate-x-full" : "ltr:translate-x-full rtl:-translate-x-full";
}

function defaultFabPosition(side: AsideSide) {
  return side === "start" ? "bottom-4 start-4" : "bottom-4 end-4";
}

function GAside({
  side,
  widthExpanded,
  mode = "inline",
  defaultDesktopCollapsed = false,
  collapsedIcon,
  expandedBrand,
  children,
  footer,
  fab,
  fabClassName,
  ariaLabel,
}: GAsideProps) {
  const aside = useAside(defaultDesktopCollapsed);
  const { collapsed, open, isDesktop } = aside;

  const isInlineDesktop = mode === "inline" && isDesktop;
  const isOverlay = !isInlineDesktop;
  const showBackdrop = isOverlay && open;

  const asideClass = clsx(
    "flex flex-col shrink-0 h-dvh-safe bg-bg-sidebar transition-transform duration-200",
    side === "start" ? "border-e border-border" : "border-s border-border",

    isInlineDesktop
      ? collapsed
        ? "w-20"
        : widthExpanded
      : [
          "fixed inset-y-0 z-50",
          sidePosition(side),
          open ? ["translate-x-0 shadow-2xl", widthExpanded] : [hiddenTransform(side), "w-0 overflow-hidden border-0 pointer-events-none"],
        ],
  );

  return (
    <AsideContext.Provider value={aside}>
      {showBackdrop && <GBackdrop onClick={aside.closeMobile} />}

      <aside
        className={asideClass}
        aria-label={ariaLabel}
        role={isOverlay ? "dialog" : undefined}
        aria-modal={isOverlay && open ? true : undefined}
        aria-hidden={isOverlay && !open ? true : undefined}>
        {/* Header */}
        <header className="h-20 shrink-0 border-b border-border flex items-center px-4">
          <div className={clsx("flex items-center w-full gap-2", collapsed && isInlineDesktop && "justify-center")}>
            {collapsed && isInlineDesktop ? (
              <GButton variant="ghost" size="icon" onClick={aside.expand} aria-label={`Expand ${ariaLabel}`}>
                {collapsedIcon}
              </GButton>
            ) : (
              <div className="flex-1 min-w-0 flex items-center gap-3">{expandedBrand}</div>
            )}

            {isInlineDesktop && !collapsed && (
              <GButton variant="ghost" size="icon" onClick={aside.collapse} className="ms-auto" aria-label={`Collapse ${ariaLabel}`}>
                <X size={18} />
              </GButton>
            )}

            {isOverlay && open && (
              <GButton variant="ghost" size="icon" onClick={aside.closeMobile} className="ms-auto" aria-label={`Close ${ariaLabel}`}>
                <X size={20} />
              </GButton>
            )}
          </div>
        </header>

        {(isInlineDesktop || open) && <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">{children}</main>}

        {footer && (isInlineDesktop || open) && <footer className="border-t border-border">{footer}</footer>}
      </aside>

      {isOverlay && !open && (
        <GButton
          fab
          variant="secondary"
          size="icon"
          rounded="full"
          onClick={aside.openMobile}
          className={fabClassName ?? defaultFabPosition(side)}
          aria-label={`Open ${ariaLabel}`}>
          {fab ?? collapsedIcon}
        </GButton>
      )}
    </AsideContext.Provider>
  );
}

export { GAside, useAsideCtx, type GAsideProps, type AsideSide, type AsideMode };
