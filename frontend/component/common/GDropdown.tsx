"use client";

import { cloneElement, isValidElement, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/cn";
import { useOverlayPosition } from "@/hooks/useOverlayPosition";

import type { IGDropdownProps } from "./def/GDropdown";

interface IDropdownLayout {
  x: number;
  y: number;
}

const TRIGGER_FOCUSABLE = 'button, a[href], [tabindex]:not([tabindex="-1"])';

function GDropdown({ open, onClose, trigger, children, align = "end", className, triggerClassName }: IGDropdownProps) {
  const compute = useCallback(
    (anchor: DOMRect, menu: DOMRect, ctx: { viewportWidth: number; viewportHeight: number; rtl: boolean }) => {
      const menuWidth = menu.width || 208;
      let x: number;
      let y: number;
      switch (align) {
        case "left":
          x = ctx.rtl ? anchor.right + 6 : anchor.left - menuWidth - 6;
          y = anchor.top;
          break;
        case "right":
          x = ctx.rtl ? anchor.left - menuWidth - 6 : anchor.right + 6;
          y = anchor.top;
          break;
        case "top":
          x = ctx.rtl ? anchor.right - menu.width : anchor.left;
          y = anchor.top - menu.height - 6;
          break;
        default:
          x = ctx.rtl ? anchor.left : anchor.right - menuWidth;
          y = anchor.bottom + 6;
          break;
      }
      x = Math.max(4, Math.min(x, ctx.viewportWidth - menuWidth - 4));
      y = Math.max(4, Math.min(y, ctx.viewportHeight - menu.height - 4));
      return { x, y };
    },
    [align],
  );

  const { anchorRef, floatingRef, output } = useOverlayPosition<IDropdownLayout, HTMLDivElement, HTMLDivElement>({ open, compute });
  const position = output as IDropdownLayout | null;
  const escapeCloseRef = useRef(false);

  // Restore focus to the trigger when the menu is dismissed with Escape.
  useEffect(() => {
    if (open || !escapeCloseRef.current) return;
    escapeCloseRef.current = false;
    anchorRef.current?.querySelector<HTMLElement>(TRIGGER_FOCUSABLE)?.focus();
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target)) return;
      if (floatingRef.current?.contains(target)) return;
      const isInsideAnyDropdown = Boolean((target as HTMLElement).closest?.('[role="menu"]'));
      if (isInsideAnyDropdown) return;
      onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, onClose, anchorRef, floatingRef]);

  useEffect(() => {
    if (!open) return;
    const getMenuItems = () => Array.from(floatingRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []);
    const frame = requestAnimationFrame(() => getMenuItems()[0]?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        escapeCloseRef.current = true;
        onClose();
        return;
      }
      const navigationKeys = ["ArrowDown", "ArrowUp", "Home", "End"];
      if (!navigationKeys.includes(event.key)) return;
      event.preventDefault();
      const items = getMenuItems();
      if (!items.length) return;
      const currentIndex = items.indexOf(document.activeElement as HTMLElement);
      let nextIndex: number;
      switch (event.key) {
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = items.length - 1;
          break;
        case "ArrowDown":
          nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
          break;
        default:
          nextIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
          break;
      }
      items[nextIndex]?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, floatingRef]);

  return (
    <>
      <div ref={anchorRef} className={triggerClassName}>
        {isValidElement(trigger)
          ? cloneElement(trigger, {
              "aria-haspopup": "menu",
              "aria-expanded": open,
            } as React.HTMLAttributes<HTMLElement>)
          : trigger}
      </div>
      {open &&
        createPortal(
          <div
            ref={floatingRef}
            role="menu"
            aria-orientation="vertical"
            className={cn("fixed z-popover w-52 overflow-hidden rounded-xl border border-border bg-bg-card p-1 shadow-lg", className)}
            style={position ? { left: position.x, top: position.y } : { visibility: "hidden" }}>
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}

export { GDropdown };
