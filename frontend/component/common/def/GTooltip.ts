import type { ReactNode } from "react";

export type GTooltipSide = "top" | "bottom" | "left" | "right";

export interface IGTooltipProps {
  content: ReactNode;
  side?: GTooltipSide;
  children: ReactNode;
  className?: string;
}
