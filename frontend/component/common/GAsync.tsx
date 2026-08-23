"use client";

import { cn } from "@/lib/cn";
import { AlertTriangle } from "lucide-react";
import { GButtonAsync } from "./GButtonAsync";
import { GEmpty } from "./GEmpty";
import { GIcon } from "./GIcon";
import { GSpinner } from "./GSpinner";
import type { IGAsyncProps } from "./def/GAsync";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

function GAsync({
  loading,
  error,
  children,
  spinnerSize = SizeEnum.md,
  spinnerLabel,
  errorTitle = "Error",
  errorIcon = AlertTriangle,
  errorIconColor = AccentColorEnum.Danger,
  retryLabel = "Retry",
  onRetry,
  className,
}: IGAsyncProps) {
  if (loading) {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <GSpinner size={spinnerSize} ariaLabel={spinnerLabel} />
        {spinnerLabel && <p className="text-sm text-text-secondary">{spinnerLabel}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center justify-center", className)}>
        <GEmpty icon={<GIcon icon={errorIcon} size={SizeEnum.xl} color={errorIconColor} />} title={errorTitle} description={error}>
          {onRetry && (
            <GButtonAsync variant={ButtonVariantEnum.Primary} size={SizeEnum.md} className="mt-4" onClick={onRetry}>
              {retryLabel}
            </GButtonAsync>
          )}
        </GEmpty>
      </div>
    );
  }

  return <>{children}</>;
}

export { GAsync };
