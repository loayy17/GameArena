"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import type { GSelectProps } from "./def/GSelect";

const rounded: Record<string, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-full",
};

const inputSize: Record<string, string> = {
  xs: "px-1 py-1.5 text-xs",
  sm: "px-1 py-1 text-sm",
  md: "px-2 py-2 text-sm",
  lg: "px-2 py-2.5 text-base",
  xl: "px-3 py-3 text-base",
};

const GSelect = forwardRef<HTMLSelectElement, GSelectProps<string | number>>(
  (
    {
      label,
      error,
      className,
      startIcon,
      options,
      placeholder,
      size = "md",
      ...props
    },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        {label && <GLabel required={props.required}>{label}</GLabel>}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
              {startIcon}
            </div>
          )}

          <select
            ref={ref}
            className={clsx(
              "w-full appearance-none border border-border bg-bg-card text-text outline-none",
              rounded.md,
              "transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
              inputSize[size],
              startIcon && "ps-9",
              "pe-9",
              error && "border-danger",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={String(opt.value)} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

GSelect.displayName = "GSelect";

export { GSelect };
