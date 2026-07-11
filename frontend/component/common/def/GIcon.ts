import type { LucideIcon } from "lucide-react";

interface GIconProps {
  icon: LucideIcon;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "secondary" | "muted" | "success" | "warning" | "danger" | "inherit";
  flip?: boolean;
  className?: string;
}

export type { GIconProps };
