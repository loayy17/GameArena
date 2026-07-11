"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import type { GTextareaProps } from "./def/GTextarea";

const inputSize: Record<string, string> = {
  xs: "px-1 py-1.5 text-xs",
  sm: "px-1 py-1 text-sm",
  md: "px-2 py-2 text-sm",
  lg: "px-2 py-2.5 text-base",
  xl: "px-3 py-3 text-base",
};

const GTextarea = forwardRef<HTMLTextAreaElement, GTextareaProps>(
  ({ label, error, className, required, size = "md", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <GLabel required={required}>{label}</GLabel>}
        <textarea
          ref={ref}
          className={clsx(
            "w-full border border-border bg-surface text-text outline-none resize-none placeholder:text-text-muted",
            "rounded-[var(--radius-md)] transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
            inputSize[size],
            error && "border-danger",
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  },
);

GTextarea.displayName = "GTextarea";

export { GTextarea };
