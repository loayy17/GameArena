import type { ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from "react";
import type { LucideIcon } from "lucide-react";

import type { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { TAccentTone } from "@/domain/constant/style-tokens";
import type { GTooltipSide } from "./GTooltip";

export interface IGButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onClick?: (event: MouseEvent<HTMLElement>) => void | Promise<unknown>;
  variant?: ButtonVariantEnum;
  size?: SizeEnum;
  tone?: TAccentTone;
  icon?: LucideIcon;
  flip?: boolean;
  label?: string;
  tooltipSide?: GTooltipSide;
  href?: string;
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  tooltipPosition?: GTooltipSide;
  ref?: Ref<HTMLButtonElement>;
}

export type { IGButtonProps as IGIconButtonProps };
export type { GTooltipSide };
