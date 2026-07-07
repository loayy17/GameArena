import clsx from "clsx";
import type { GIconTileProps } from "./def/GIconTile";
import { gradient, iconTileSize, rounded } from "./tokens";

function GIconTile({
  children,
  gradient: gradientProp = "brand",
  size = "md",
  rounded: roundedProp = "md",
}: GIconTileProps) {
  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center",
        iconTileSize[size],
        rounded[roundedProp],
        gradient[gradientProp],
      )}
    >
      {children}
    </div>
  );
}

export { GIconTile };
