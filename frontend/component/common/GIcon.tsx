import clsx from "clsx";
import type { GIconProps } from "./def/GIcon";
import { iconSize } from "./tokens";

const colors = {
  primary: "text-primary",
  secondary: "text-text-secondary",
  muted: "text-text-muted",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  inherit: "",
};

function GIcon({
  icon: Icon,
  size = "md",
  color = "inherit",
  flip = true,
  className,
}: GIconProps) {
  return (
    <Icon
      className={clsx(
        "shrink-0",
        iconSize[size],
        colors[color],
        flip && "icon-flip",
        className,
      )}
    />
  );
}

export { GIcon };
