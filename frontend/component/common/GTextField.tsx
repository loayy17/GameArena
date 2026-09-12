"use client";

import { cn } from "@/lib/cn";
import { useField } from "@/hooks/useField";
import { fieldBase, fieldError, fieldSize } from "@/domain/constant/style-tokens";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GLabel } from "./GLabel";

import type { IGTextFieldProps } from "./def/GTextField";

function GTextField({ label, error, hint, startIcon, endIcon, endAction, required, size = SizeEnum.md, className, name, id, type = "text", ref, ...props }: IGTextFieldProps) {
  const field = useField({ id, name, prefix: "field", error, hint });
  const hasStartIcon = Boolean(startIcon);
  const hasEnd = Boolean(endAction ?? endIcon);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <GLabel required={required} htmlFor={field.inputId}>
          {label}
        </GLabel>
      )}
      <div className="relative">
        {startIcon && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-text-muted">
            {startIcon}
          </span>
        )}
        <input
          ref={ref}
          id={field.inputId}
          name={name}
          type={type}
          aria-required={required || undefined}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid}
          {...props}
          className={cn(fieldBase, fieldSize[size], hasStartIcon && "ps-10", hasEnd && "pe-10", !error && "hover:border-text-muted/50", error && fieldError)}
        />
        {endAction ? (
          <span className="absolute end-1.5 top-1/2 -translate-y-1/2">{endAction}</span>
        ) : (
          endIcon && <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2">{endIcon}</span>
        )}
      </div>
      {error ? (
        <p {...field.errorProps} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : (
        hint && (
          <p {...field.hintProps} className="mt-1.5 text-xs text-text-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

export { GTextField };
