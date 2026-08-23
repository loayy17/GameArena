"use client";

import { cn } from "@/lib/cn";
import { forwardRef, useId } from "react";
import { GLabel } from "./GLabel";
import type { IGTextFieldProps } from "./def/GTextField";
import { fieldBase, fieldSize } from "@/domain/constant/size-classes";
import { SizeEnum } from "@/domain/enum/SizeEnum";

const GTextField = forwardRef<HTMLInputElement, IGTextFieldProps>(
  ({ label, error, startIcon, endIcon, required, size = SizeEnum.md, className, name, id: providedId, type = "text", ...props }, ref) => {
    const generatedId = useId();
    const inputId = providedId ?? (name ? `field-${name}` : `field-${generatedId}`);
    const errorId = `${inputId}-error`;

    const hasStartIcon = Boolean(startIcon);
    const hasEndIcon = Boolean(endIcon);

    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <GLabel required={required} htmlFor={inputId}>
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
            id={inputId}
            name={name}
            type={type}
            aria-required={required || undefined}
            {...props}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
            className={cn(
              fieldBase,
              fieldSize[size],
              hasStartIcon && "ps-10",
              hasEndIcon && "pe-10",
              error && "border-danger focus:border-danger focus:ring-danger-muted",
              "transition-colors",
            )}
          />
          {endIcon && <span className="absolute end-3 top-1/2 -translate-y-1/2">{endIcon}</span>}
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-danger font-medium">
            {error}
          </p>
        )}
      </div>
    );
  },
);

GTextField.displayName = "GTextField";

export { GTextField };
