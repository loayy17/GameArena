"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import type { GTextFieldProps } from "./def/GTextField";

const inputSize: Record<string, string> = {
  xs: "px-1 py-1.5 text-xs",
  sm: "px-1 py-1 text-sm",
  md: "px-2 py-2 text-sm",
  lg: "px-2 py-2.5 text-base",
  xl: "px-3 py-3 text-base",
};

const fieldBase = clsx(
  "w-full border border-border bg-surface text-text outline-none placeholder:text-text-muted",
  "rounded-[var(--radius-md)] transition-colors duration-150",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
);

const GTextField = forwardRef<HTMLInputElement, GTextFieldProps>(
  (
    {
      label,
      error,

      startIcon,
      endIcon,

      required,
      size = "md",

      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        {label && <GLabel required={required}>{label}</GLabel>}

        <div className="relative">
          {startIcon && (
            <div
              className="absolute start-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none
           ">
              {startIcon}
            </div>
          )}

          {endIcon && <div className="absolute end-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">{endIcon}</div>}

          <input
            ref={ref}
            className={clsx(
              fieldBase,
              inputSize[size],

              error && "border-danger focus-visible:ring-danger/20",

              startIcon && "ps-10",
              endIcon && "pe-10",

              className,
            )}
            {...props}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

GTextField.displayName = "GTextField";

export { GTextField };
