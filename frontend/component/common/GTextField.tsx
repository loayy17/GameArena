"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import type { GTextFieldProps } from "./def/GTextField";

const INPUT_SIZES = {
  xs: "px-2.5 py-1.5 text-xs",
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-4 py-3 text-base",
  xl: "px-4 py-3.5 text-base",
} as const;

const FIELD_BASE_CLASS = clsx(
  "w-full bg-surface border border-border rounded-[var(--radius-md)] text-text transition-all duration-150",
  "hover:border-border-light focus:border-primary focus:ring-3 focus:ring-primary-muted",
  "placeholder:text-text-muted",
);

const GTextField = forwardRef<HTMLInputElement, GTextFieldProps>(
  ({ label, error, startIcon, endIcon, required, size = "md", className, ...props }, ref) => {
    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);
    return (
      <div className="space-y-2">
        {label && <GLabel required={required}>{label}</GLabel>}
        <div className="relative">
          {startIcon && (
            <span aria-hidden="true" className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-text-muted">
              {startIcon}
            </span>
          )}
          <input
            ref={ref}
            {...props}
            className={clsx(
              FIELD_BASE_CLASS,
              INPUT_SIZES[size],
              hasStartIcon && "ps-10",
              hasEndIcon && "pe-10",
               error && "border-error focus:ring-3 focus:ring-error-muted",
              className,
            )}
          />
          {endIcon && <span className="absolute inset-e-3 top-1/2 -translate-y-1/2">{endIcon}</span>}
        </div>
        {error && (
          <p role="alert" className="text-xs text-error mt-1.5">
            {error}
          </p>
        )}
      </div>
    );
  },
);

GTextField.displayName = "GTextField";

export { GTextField };
