"use client";

import { cn } from "@/lib/cn";
import { Loader2 } from "lucide-react";
import type { IGSpinnerProps } from "./def/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { spinnerSize } from "@/domain/constant/size-classes";

function GSpinner({ size = SizeEnum.md, color = AccentColorEnum.Primary, className, ariaLabel }: IGSpinnerProps) {
  return (
    <div className="relative inline-flex items-center justify-center">
      <Loader2 role="status" aria-label={ariaLabel} className={cn("animate-spin", color, spinnerSize[size], className)} />
    </div>
  );
}

export { GSpinner };
