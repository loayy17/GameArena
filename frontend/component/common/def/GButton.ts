import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface IGButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: ButtonVariantEnum;
  size?: SizeEnum;
  rounded?: SizeEnum;
  align?: "start" | "center" | "end";
  fullWidth?: boolean;
}

export type { IGButtonProps };
