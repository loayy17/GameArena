"use client";

import clsx from "clsx";
import { RefreshCw } from "lucide-react";
import { GButton } from "./GButton";
import { GCard } from "./GCard";
import type { GErrorBannerProps } from "./def/GErrorBanner";

function GErrorBanner({
  message,
  onRetry,
  retryLabel,
  className,
}: GErrorBannerProps) {
  return (
    <GCard
      variant="outlined"
      padding="sm"
      className={clsx("border-danger/30 bg-danger-bg text-danger", className)}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm">{message}</div>
        {onRetry && (
          <GButton
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
          >
            {retryLabel ?? "Retry"}
          </GButton>
        )}
      </div>
    </GCard>
  );
}

export { GErrorBanner };
