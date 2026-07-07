import type { LucideIcon } from "lucide-react";
import type { GSize } from "../tokens";

interface GIconProps {
  icon: LucideIcon;
  size?: GSize;
  color?: "primary" | "secondary" | "muted" | "success" | "warning" | "danger" | "inherit";
  flip?: boolean;
  className?: string;
}

export type { GIconProps };
