"use client";

import type React from "react";
import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { GBackdrop } from "./GBackdrop";
import { GCard } from "./GCard";
import type { GModalProps } from "./def/GModal";

const sizeStyles: Record<string, string> = {
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-md",
  xl: "max-w-lg",
};

function GModal({
  open,
  onClose,
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
  size = "md",
  cardPadding = "lg",
  role = "dialog",
  ariaLabel,
  ariaDescription,
  className,
  ...props
}: GModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === "Escape") onClose();
    },
    [closeOnEscape, onClose],
  );

  const handleBackdropClick = useCallback(() => {
    if (!closeOnBackdrop) return;
    onClose();
  }, [closeOnBackdrop, onClose]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className={clsx("fixed inset-0 z-50 flex items-center justify-center", className)}
      role={role}
      aria-modal="true"
      aria-label={ariaLabel ?? "modal"}
      aria-describedby={ariaDescription ? "modal-description" : undefined}
      {...props}>
      <GBackdrop onClick={handleBackdropClick} />
      <GCard
        padding={cardPadding}
        className={clsx("relative z-50 mx-auto w-full", sizeStyles[size])}
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
