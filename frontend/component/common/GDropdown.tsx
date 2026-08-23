"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

import type { IGDropdownProps } from "./def/GDropdown";

type TPosition = {
  x: number;
  y: number;
};

function GDropdown({ open, onClose, trigger, children, align = "end", className }: IGDropdownProps) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<TPosition | null>(null);
  const getMenuItems = useCallback(() => Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])') ?? []), []);
  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;
    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const rtl = document.documentElement.dir === "rtl";
    const menuWidth = menuRect.width || 208;
    const menuHeight = menuRect.height;
    let x: number;
    let y: number;
    switch (align) {
      case "left":
        x = rtl ? triggerRect.right + 6 : triggerRect.left - menuWidth - 6;
        y = triggerRect.top;
        break;
      case "right":
        x = rtl ? triggerRect.left - menuWidth - 6 : triggerRect.right + 6;
        y = triggerRect.top;
        break;
      case "top":
        x = rtl ? triggerRect.right - menuWidth : triggerRect.left;
        y = triggerRect.top - menuHeight - 6;
        break;
      case "end":
      default:
        x = rtl ? triggerRect.left : triggerRect.right - menuWidth;
        y = triggerRect.bottom + 6;
        break;
    }
    const maxX = viewportWidth - menuWidth - 4;
    const maxY = viewportHeight - menuHeight - 4;
    x = Math.max(4, Math.min(x, maxX));
    y = Math.max(4, Math.min(y, maxY));

    setPosition({ x, y });
  }, [align]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest("[data-gdropdown-menu]")) return;
      onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const resizeObserver = menuRef.current ? new ResizeObserver(updatePosition) : null;
    if (resizeObserver && menuRef.current) resizeObserver.observe(menuRef.current);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      resizeObserver?.disconnect();
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => getMenuItems()[0]?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
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
        case "ArrowUp":
          nextIndex = currentIndex === -1 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
          break;
        default:
          return;
      }
      items[nextIndex]?.focus();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, getMenuItems]);
  return (
    <>
      <div ref={triggerRef} className="flex-1">
        {trigger}
      </div>
      {open &&
        createPortal(
          <div
            ref={menuRef}
            data-gdropdown-menu
            role="menu"
            aria-orientation="vertical"
            className={cn("fixed z-popover w-52 overflow-hidden rounded-xl border border-border bg-bg-card shadow-lg", className)}
            style={
              position
                ? {
                    left: position.x,
                    top: position.y,
                  }
                : {
                    visibility: "hidden",
                  }
            }>
            {children}
          </div>,
          document.body,
        )}
    </>
  );
}

export { GDropdown };
