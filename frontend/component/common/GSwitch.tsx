"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/cn";
import { GLabel } from "./GLabel";
import type { IGSwitchProps } from "./def/GSwitch";

const GSwitch = forwardRef<HTMLInputElement, IGSwitchProps>(
  ({ checked, label, error, required, className, id: providedId, name, disabled, children, ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId ?? (name ? `switch-${name}` : `switch-${generatedId}`);
    const errorId = `${inputId}-error`;

    return (
      <div className={cn("space-y-2", className)}>
        <label htmlFor={inputId} className={cn("inline-flex cursor-pointer items-center gap-3", disabled && "cursor-not-allowed opacity-60")}>
          <span className="relative inline-flex shrink-0">
            <input
              ref={ref}
              id={inputId}
              name={name}
              type="checkbox"
              role="switch"
              aria-checked={checked}
              aria-required={required || undefined}
              aria-describedby={error ? errorId : undefined}
              aria-invalid={error ? true : undefined}
              checked={checked}
              disabled={disabled}
              {...props}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className={cn(
                "relative h-6 w-11 rounded-full transition-colors",
                "bg-border hover:bg-border-light",
                "peer-checked:bg-primary",
                "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-muted",
                "peer-disabled:opacity-60 peer-disabled:cursor-not-allowed",
                "after:absolute after:inset-s-1 after:top-1",
                "after:h-4 after:w-4 after:rounded-full after:bg-bg-elevated after:shadow-sm",
                "after:transition-transform",
                "peer-checked:after:translate-x-5",
                "rtl:peer-checked:after:-translate-x-5",
              )}
            />
          </span>
          {label && (
            <GLabel required={required} htmlFor={inputId} className="mb-0">
              {label}
            </GLabel>
          )}
          {children && <span className="min-w-0 flex-1 text-sm">{children}</span>}
        </label>
        {error && (
          <p id={errorId} role="alert" className="text-xs text-danger font-medium">
            {error}
          </p>
        )}
      </div>
    );
  },
);

GSwitch.displayName = "GSwitch";

export { GSwitch };
