"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/cn";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { modalSize } from "@/domain/constant/style-tokens";

import { GBackdrop } from "./GBackdrop";
import { GCard } from "./GCard";

import type { GModalSide, IGModalProps } from "./def/GModal";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

const sheetSideStyles: Record<Exclude<GModalSide, "center">, string> = {
  start: "inset-y-0 start-0 w-64 sheet-max-width border-e border-border animate-slide-in-start",
  end: "inset-y-0 end-0 w-80 sheet-max-width border-s border-border animate-slide-in-end",
  bottom: "inset-x-0 bottom-0 sheet-max-height border-t border-border rounded-t-3xl pb-safe-only animate-slide-in-bottom",
};

function GModal({
  open,
  onClose,
  children,
  size = SizeEnum.md,
  side = "center",
  className,
  panelClassName,
  role = "dialog",
  ariaLabel,
  ...props
}: IGModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const panel = panelRef.current;
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    previousFocusRef.current = document.activeElement as HTMLElement;
    const frame = requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus());

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(frame);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [open, onClose]);

  const dialogAria = {
    role,
    "aria-modal": true,
    "aria-label": ariaLabel,
    ...props,
  } as React.HTMLAttributes<HTMLElement>;

  if (side !== "center") {
    return (
      <div className={className}>
        {open && (
          <>
            <GBackdrop onClick={onClose} />
            <aside ref={panelRef} {...dialogAria} className={cn("fixed z-drawer flex flex-col bg-bg-sidebar", sheetSideStyles[side], panelClassName)}>
              {children}
            </aside>
          </>
        )}
      </div>
    );
  }

  if (!open) return null;

  return (
    <div className={cn("fixed inset-0 z-modal", className)}>
      <GBackdrop onClick={onClose} />
      <div className="fixed inset-0 z-modal flex items-center justify-center p-4" onClick={onClose}>
        <GCard
          ref={panelRef}
          {...dialogAria}
          className={cn("relative mx-auto max-h-full w-full overflow-y-auto p-6 shadow-xl custom-scrollbar animate-scale-in", modalSize[size], panelClassName)}
          onClick={(event: React.MouseEvent) => event.stopPropagation()}>
          {children}
        </GCard>
      </div>
    </div>
  );
}

export { GModal };
