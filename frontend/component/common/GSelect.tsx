"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import type { GSelectProps } from "./def/GSelect";
import { focusRing, inputSize, rounded, transition } from "./tokens";

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
              transition,
              focusRing,
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
