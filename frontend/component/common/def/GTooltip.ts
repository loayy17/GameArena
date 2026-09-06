import type { ReactNode } from "react";

export type GTooltipSide = "top" | "bottom" | "start" | "end";

interface IGTooltipProps {
  content: ReactNode;
  side?: GTooltipSide;
  children: ReactNode;
  className?: string;
}

export type { IGTooltipProps };
