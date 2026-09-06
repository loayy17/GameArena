"use client";

import { cn } from "@/lib/cn";

import type { ITypingIndicatorProps } from "./def/TypingIndicator";

function TypingIndicator({ className }: ITypingIndicatorProps) {
  return (
    <div className={cn("flex justify-start", className)} aria-live="polite">
      <div className="animate-scale-in flex items-center gap-1.5 rounded-2xl rounded-es-sm border border-border bg-surface px-4 py-3 shadow-sm">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-2 rounded-full bg-text-muted"
            style={{ animation: `typing-dot 1.3s ease-in-out ${i * 180}ms infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

export { TypingIndicator };
