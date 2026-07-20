import type { LucideIcon } from "lucide-react";
import type { MouseEvent } from "react";

type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
type IconColor = "primary" | "secondary" | "muted" | "success" | "warning" | "danger" | "inherit" | "on-primary" | "accent" | "text";
type TileSize = "xs" | "sm" | "md" | "lg" | "xl";
type TileRounded = "sm" | "md" | "lg" | "full";
type TileGradient = string;

export interface GIconProps {
  icon: LucideIcon;
  size?: IconSize;
  color?: IconColor;
  flip?: boolean;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  // Tile props (when used as icon tile)
  tile?: boolean;
  tileSize?: TileSize;
  tileRounded?: TileRounded;
  tileGradient?: TileGradient;
  tileColor?: IconColor;
  tileClassName?: string;
}
