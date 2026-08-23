"use client";

import type React from "react";
import { cn } from "@/lib/cn";
import { useCallback, useEffect, useRef } from "react";
import { GBackdrop } from "./GBackdrop";
import { GCard } from "./GCard";
import type { IGModalProps, GModalSide } from "./def/GModal";
import type { TNullable } from "@/domain/type/TCommon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { modalSize } from "@/domain/constant/size-classes";

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
  closeOnBackdrop = true,
  closeOnEscape = true,
  size = SizeEnum.md,
  cardPadding = SizeEnum.lg,
  side = "center",
  panelClassName,
  role = "dialog",
  ariaLabel,
  ariaDescription,
  className,
  ...props
}: IGModalProps) {
  const modalRef = useRef<TNullable<HTMLDivElement>>(null);
  const previousFocusRef = useRef<TNullable<HTMLElement>>(null);

  const isSheet = side !== "center";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose();
        return;
      }

      if (isSheet || !modalRef.current) return;

      if (e.key !== "Tab") return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [closeOnEscape, isSheet, onClose],
  );

  const handleBackdropClick = useCallback(() => {
    if (!closeOnBackdrop) return;
    onClose();
  }, [closeOnBackdrop, onClose]);

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    previousFocusRef.current = document.activeElement as HTMLElement;
    const timer = requestAnimationFrame(() => {
      if (modalRef.current) {
        const focusable = modalRef.current.querySelector<HTMLElement>(FOCUSABLE);
        focusable?.focus();
      }
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(timer);
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [open, handleKeyDown]);

  if (isSheet) {
    return (
      <div className={className}>
        {open && (
          <>
            <GBackdrop onClick={handleBackdropClick} />
            <aside
              ref={modalRef}
              role={role}
              aria-modal="true"
              aria-label={ariaLabel}
              className={cn("fixed z-drawer flex flex-col bg-bg-sidebar", sheetSideStyles[side], panelClassName)}>
              {children}
            </aside>
          </>
        )}
      </div>
    );
  }

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className={cn("fixed inset-0 z-modal flex items-center justify-center p-4", className)}
      role={role}
      aria-modal="true"
      aria-label={ariaLabel}
      aria-describedby={ariaDescription ? "modal-description" : undefined}
      {...props}>
      <GBackdrop onClick={handleBackdropClick} />
      <GCard
        padding={cardPadding}
        className={cn("relative z-modal mx-auto w-full max-h-full overflow-y-auto custom-scrollbar animate-scale-in", "shadow-xl", modalSize[size])}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {ariaDescription && (
          <p id="modal-description" className="sr-only">
            {ariaDescription}
          </p>
        )}
        {children}
      </GCard>
    </div>
  );
}

export { GModal };
