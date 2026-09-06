"use client";

import { Check } from "lucide-react";

import { cn } from "@/lib/cn";
import { useField } from "@/hooks/useField";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GIcon } from "./GIcon";
import { GLabel } from "./GLabel";

import type { IGCheckboxProps } from "./def/GCheckbox";

function GCheckbox({ checked, label, error, required, className, id, name, disabled, children, ref, ...props }: IGCheckboxProps) {
  const field = useField({ id, name, prefix: "checkbox", error });

  return (
    <div className={cn("space-y-2", className)}>
      <label htmlFor={field.inputId} className={cn("inline-flex cursor-pointer items-start gap-3", disabled && "cursor-not-allowed opacity-60")}>
        <span className="relative mt-0.5 inline-flex shrink-0">
          <input
            ref={ref}
            id={field.inputId}
            name={name}
            type="checkbox"
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
              "flex size-5 items-center justify-center rounded-md border bg-surface",
              "border-text-muted/50 hover:border-primary/60",
              "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-on-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-muted",
              "peer-disabled:opacity-60 peer-disabled:cursor-not-allowed",
            )}>
            <GIcon icon={Check} size={SizeEnum.xs} className={cn("opacity-0", checked && "opacity-100")} />
          </span>
        </span>
        {label && (
          <GLabel required={required} htmlFor={field.inputId} className="mb-0">
            {label}
          </GLabel>
        )}
        {children && <span className="min-w-0 flex-1 text-sm leading-relaxed text-text-secondary">{children}</span>}
      </label>
      {error && (
        <p {...field.errorProps} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export { GCheckbox };
