import clsx from "clsx";
import type { GIconTileProps } from "./def/GIconTile";
import { GIcon } from "./GIcon";

const iconTileSize: Record<string, string> = {
  xs: "w-8 h-8",
  sm: "w-10 h-10",
  md: "w-12 h-12",
  lg: "w-14 h-14",
  xl: "w-16 h-16",
};

const rounded: Record<string, string> = {
  sm: "rounded-[var(--radius-sm)]",
  md: "rounded-[var(--radius-md)]",
  lg: "rounded-[var(--radius-lg)]",
  full: "rounded-full",
};

function GIconTile({ children, gradient, size = "md", rounded: roundedProp = "md", icon, className, iconColor, ...rest }: GIconTileProps) {
  return (
    <div className={clsx("flex shrink-0 items-center justify-center", iconTileSize[size], rounded[roundedProp], gradient, className)} {...rest}>
      {children ?? (icon && <GIcon icon={icon} color={iconColor} />)}
    </div>
  );
}

export { GIconTile };
