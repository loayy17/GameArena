"use client";

import { cn } from "@/lib/cn";
import { useField } from "@/hooks/useField";

import { GLabel } from "./GLabel";

import type { IGSwitchProps } from "./def/GSwitch";

function GSwitch({ checked, label, error, required, className, id, name, disabled, children, ref, ...props }: IGSwitchProps) {
  const field = useField({ id, name, prefix: "switch", error });

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={field.inputId} className={cn("inline-flex cursor-pointer items-center gap-3", disabled && "cursor-not-allowed opacity-60")}>
        <span className="relative inline-flex shrink-0">
          <input
            ref={ref}
            id={field.inputId}
            name={name}
            type="checkbox"
            role="switch"
            aria-checked={checked}
            aria-required={required || undefined}
            aria-describedby={field.describedBy}
            aria-invalid={field.invalid}
            checked={checked}
            disabled={disabled}
            {...props}
            className="peer sr-only"
          />
          <span
            aria-hidden="true"
            className={cn(
              "relative h-6 w-11 rounded-full",
              "bg-border hover:bg-text-muted/40",
              "peer-checked:bg-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-muted",
              "peer-disabled:opacity-60 peer-disabled:cursor-not-allowed",
              "after:absolute after:inset-s-1 after:top-1",
              "after:h-4 after:w-4 after:rounded-full after:bg-bg-elevated after:shadow-sm",
              "peer-checked:after:translate-x-5",
              "rtl:peer-checked:after:-translate-x-5",
            )}
          />
        </span>
        {label && (
          <GLabel required={required} htmlFor={field.inputId} className="mb-0">
            {label}
          </GLabel>
        )}
        {children && <span className="min-w-0 flex-1 text-sm">{children}</span>}
      </label>
      {error && (
        <p {...field.errorProps} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export { GSwitch };
