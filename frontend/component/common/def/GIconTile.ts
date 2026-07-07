import type { ReactNode } from "react";
import type { GGradient, GSize, GRounded } from "../tokens";

interface GIconTileProps {
  children: ReactNode;
  gradient?: GGradient;
  size?: GSize;
  rounded?: GRounded;
}

export type { GIconTileProps };
