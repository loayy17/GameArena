import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface GIconTileProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  gradient?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  rounded?: "sm" | "md" | "lg" | "full";
  icon?: LucideIcon;
  iconColor?: "primary" | "secondary" | "muted" | "success" | "warning" | "danger" | "inherit";
}

export type { GIconTileProps };
