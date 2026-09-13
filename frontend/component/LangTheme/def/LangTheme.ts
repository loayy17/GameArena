import type { SizeEnum } from "@/domain/enum/SizeEnum";
import type { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { GTooltipSide } from "@/component/common/def/GTooltip";

type TLangThemeVariant = "compact" | "equal";

interface ILangThemeProps {
  collapsed?: boolean;
  align?: "top" | "left" | "right" | "end";
  variant?: TLangThemeVariant;
  size?: SizeEnum;
  buttonVariant?: ButtonVariantEnum;
  tooltipSide?: GTooltipSide;
  className?: string;
  fill?: boolean;
}

export type { ILangThemeProps, TLangThemeVariant };
