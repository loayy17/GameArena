"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import { GTextFieldProps } from "./def/GTextField";
import { focusRing, inputSize, rounded, transition } from "./tokens";

const fieldBase = clsx(
  "w-full border border-border bg-surface text-text outline-none placeholder:text-text-muted",
  rounded.md,
  transition,
  focusRing,
);

const GTextField = forwardRef<HTMLInputElement, GTextFieldProps>(
  (
    {
      label,
      error,
      className,
      startIcon,
      endIcon,
      required,
      size = "md",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        {label && <GLabel required={required}>{label}</GLabel>}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {startIcon}
            </div>
          )}

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

          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {endIcon}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

GTextField.displayName = "GTextField";

export { GTextField };
