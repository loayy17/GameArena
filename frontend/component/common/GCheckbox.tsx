"use client";

import { forwardRef, useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { GLabel } from "./GLabel";
import type { IGCheckboxProps } from "./def/GCheckbox";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { GIcon } from "./GIcon";

const GCheckbox = forwardRef<HTMLInputElement, IGCheckboxProps>(({ checked, label, error, required, className, id: providedId, name, disabled, children, ...props }, ref) => {
  const generatedId = useId();
  const inputId = providedId ?? (name ? `cb-${name}` : `cb-${generatedId}`);
  const errorId = `${inputId}-error`;

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={inputId} className={cn("inline-flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60")}>
        <span className="relative inline-flex shrink-0 mt-0.5">
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="checkbox"
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
              "flex size-5 items-center justify-center rounded-md border bg-surface transition-colors",
              "border-border hover:border-border-light",
              "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-muted",
              "peer-disabled:opacity-60 peer-disabled:cursor-not-allowed",
            )}>
            <GIcon icon={Check} size={SizeEnum.xs} className={cn("opacity-0 transition-opacity", checked && "opacity-100")} />
          </span>
        </span>
        {label && (
          <GLabel required={required} htmlFor={inputId} className="mb-0">
            {label}
          </GLabel>
        )}
        {children && <span className="min-w-0 flex-1 text-sm leading-relaxed text-text-secondary">{children}</span>}
      </label>
      {error && (
        <p id={errorId} role="alert" className="text-xs text-danger font-medium">
          {error}
        </p>
      )}
    </div>
  );
});

GCheckbox.displayName = "GCheckbox";

export { GCheckbox };
