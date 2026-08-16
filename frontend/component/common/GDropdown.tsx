"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

import { GBackdrop } from "./GBackdrop";
import type { IGDropdownProps } from "./def/GDropdown";

const MENU_WIDTH = 208;
const VIEWPORT_GAP = 4;
const MENU_GAP = 6;

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
    const menuWidth = menuRect.width || MENU_WIDTH;
    const menuHeight = menuRect.height;
    let x: number;
    let y: number;
    switch (align) {
      case "left":
        x = rtl ? triggerRect.right + MENU_GAP : triggerRect.left - menuWidth - MENU_GAP;
        y = triggerRect.top;
        break;
      case "right":
        x = rtl ? triggerRect.left - menuWidth - MENU_GAP : triggerRect.right + MENU_GAP;
        y = triggerRect.top;
        break;
      case "top":
        x = rtl ? triggerRect.right - menuWidth : triggerRect.left;
        y = triggerRect.top - menuHeight - MENU_GAP;
        break;
      case "end":
      default:
        x = rtl ? triggerRect.left : triggerRect.right - menuWidth;
        y = triggerRect.bottom + MENU_GAP;
        break;
    }
    const maxX = viewportWidth - menuWidth - VIEWPORT_GAP;
    const maxY = viewportHeight - menuHeight - VIEWPORT_GAP;
    x = Math.max(VIEWPORT_GAP, Math.min(x, maxX));
    y = Math.max(VIEWPORT_GAP, Math.min(y, maxY));

    setPosition({ x, y });
  }, [align]);

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
      <div ref={triggerRef}>{trigger}</div>
      {open &&
        createPortal(
          <>
            <GBackdrop onClick={onClose} />
            <div
              ref={menuRef}
              role="menu"
              aria-orientation="vertical"
              className={clsx("fixed z-popover w-52 overflow-hidden rounded-xl border border-border bg-bg-card shadow-lg", className)}
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
            </div>
          </>,
          document.body,
        )}
    </>
  );
}

export { GDropdown };
