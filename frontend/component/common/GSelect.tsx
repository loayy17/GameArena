"use client";

import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/cn";
import { useField } from "@/hooks/useField";
import { fieldBase, fieldError, fieldSize } from "@/domain/constant/style-tokens";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GLabel } from "./GLabel";

import type { IGSelectProps } from "./def/GSelect";

function GSelect<TValue extends string | number>({ label, error, className, startIcon, options, placeholder, size = SizeEnum.md, id, required, ref, ...props }: IGSelectProps<TValue>) {
  const field = useField({ id, name: props.name, prefix: "select", error });

  return (
    <div className="space-y-2">
      {label && (
        <GLabel required={required} htmlFor={field.inputId}>
          {label}
        </GLabel>
      )}

      <div className="relative">
        {startIcon && <div className="pointer-events-none absolute inset-s-3 top-1/2 -translate-y-1/2 text-text-muted">{startIcon}</div>}

        <select
          ref={ref}
          id={field.inputId}
          aria-required={required || undefined}
          aria-describedby={field.describedBy}
          aria-invalid={field.invalid}
          required={required}
          className={cn(fieldBase, "appearance-none", fieldSize[size], startIcon && "ps-10", "pe-9", error && fieldError, className)}
          {...props}>
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

        <ChevronDown className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
      </div>

      {error && (
        <p {...field.errorProps} className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export { GSelect };
