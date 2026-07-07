import type { ReactNode } from "react";

interface GErrorBannerProps {
  message: ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export type { GErrorBannerProps };
