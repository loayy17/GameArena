"use client";

import clsx from "clsx";
import { forwardRef } from "react";
import { GLabel } from "./GLabel";
import { GTextareaProps } from "./def/GTextarea";
import { focusRing, inputSize, rounded, transition } from "./tokens";

const GTextarea = forwardRef<HTMLTextAreaElement, GTextareaProps>(
  ({ label, error, className, required, size = "md", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && <GLabel required={required}>{label}</GLabel>}
        <textarea
          ref={ref}
          className={clsx(
            "w-full border border-border bg-surface-alt text-text outline-none resize-none placeholder:text-text-muted",
            rounded.md,
            transition,
            focusRing,
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
