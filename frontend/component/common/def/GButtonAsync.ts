import type { MouseEvent, ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

type TGButtonAsyncClick = (event: MouseEvent<HTMLButtonElement>) => Promise<unknown> | void;

interface IGButtonAsyncProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  onClick?: TGButtonAsyncClick;
  busy?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  variant?: ButtonVariantEnum;
  size?: SizeEnum;
  rounded?: SizeEnum;
  align?: "start" | "center" | "end";
  loadingText?: string;
  fullWidth?: boolean;
}

export type { IGButtonAsyncProps, TGButtonAsyncClick };
