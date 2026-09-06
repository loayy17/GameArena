"use client";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/cn";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { spinnerSize } from "@/domain/constant/style-tokens";

import type { IGSpinnerProps } from "./def/GSpinner";

function GSpinner({ size = SizeEnum.md, color = "text-primary", className, ariaLabel }: IGSpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel || undefined}
      className={cn("animate-spin", color, spinnerSize[size], className)}
    />
  );
}

export { GSpinner };
