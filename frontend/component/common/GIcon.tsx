import clsx from "clsx";
import type { GIconProps } from "./def/GIcon";

const iconSize: Record<string, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
  "2xl": "h-10 w-10",
  "3xl": "h-12 w-12",
  "4xl": "h-16 w-16",
};

const colors = {
  primary: "text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  inherit: "",
};

function GIcon({ icon: Icon, size = "md", color = "inherit", flip = true, className }: GIconProps) {
  return <Icon className={clsx("shrink-0", iconSize[size], colors[color], flip && "icon-flip", className)} />;
}

export { GIcon };
