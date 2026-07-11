"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import type { GCheckboxProps } from "./def/GCheckbox";

const GCheckbox = forwardRef<HTMLInputElement, GCheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={clsx(
          "h-5 w-5 accent-primary rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
          className,
        )}
        {...props}
      />
    );
  },
);

GCheckbox.displayName = "GCheckbox";

export { GCheckbox };
