"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { TTextFieldProps } from "./def/TTextField";

const TTextField = forwardRef<HTMLInputElement, TTextFieldProps>(
  (
    { label, error, className, startIcon, endIcon, required, ...props },
    ref,
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium">
            {label}
            {required && (
              <span className="text-red-500" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {startIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {startIcon}
            </div>
          )}

          <input
            ref={ref}
            className={clsx(
              "w-full rounded-xl border border-border bg-surface px-4 py-3 outline-none transition-all",
              "focus:border-primary focus:ring-2 focus:ring-primary/20",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              startIcon && "pl-10",
              endIcon && "pr-10",
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

        {error && <p className="text-sm text-error">{error}</p>}
      </div>
    );
  },
);

TTextField.displayName = "TTextField";

export { TTextField };
