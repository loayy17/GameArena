import type { SizeEnum } from "@/domain/enum/SizeEnum";

type TLangThemeVariant = "compact" | "equal";

interface ILangThemeProps {
  collapsed?: boolean;
  align?: "top" | "left" | "right" | "end";
  variant?: TLangThemeVariant;
  size?: SizeEnum;
  className?: string;
  fill?: boolean;
}

export type { ILangThemeProps, TLangThemeVariant };
