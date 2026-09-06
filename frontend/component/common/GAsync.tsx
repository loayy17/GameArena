"use client";

import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/cn";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { GButton } from "./GButton";
import { GEmpty } from "./GEmpty";
import { GIcon } from "./GIcon";
import { GSpinner } from "./GSpinner";

import type { IGAsyncProps } from "./def/GAsync";

function GAsync({ loading, error, children, spinnerSize = SizeEnum.md, spinnerLabel, errorTitle, errorIcon = AlertTriangle, errorIconColor, retryLabel, onRetry, className }: IGAsyncProps) {
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
            <GButton variant={ButtonVariantEnum.Primary} className="mt-4" onClick={onRetry}>
              {retryLabel}
            </GButton>
          )}
        </GEmpty>
      </div>
    );
  }

  return <>{children}</>;
}

export { GAsync };
