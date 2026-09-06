import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import type { TAccentTone } from "@/domain/constant/style-tokens";
import type { LucideIcon } from "lucide-react";

export type GIconVariant = "inline" | "tile";

export interface IGIconProps {
  icon: LucideIcon;
  variant?: GIconVariant;
  size?: SizeEnum;
  color?: AccentColorEnum | string;
  flip?: boolean;
  gradient?: string;
  tone?: TAccentTone;
  rounded?: SizeEnum;
  className?: string;
}

export type { IGIconProps as IGIconTileProps };
