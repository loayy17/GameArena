"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { focusRing, rounded } from "./tokens";

interface GCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const GCheckbox = forwardRef<HTMLInputElement, GCheckboxProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={clsx(
          "h-5 w-5 accent-primary",
          rounded.sm,
          focusRing,
          className,
        )}
        {...props}
      />
    );
  },
);

GCheckbox.displayName = "GCheckbox";

export { GCheckbox };
