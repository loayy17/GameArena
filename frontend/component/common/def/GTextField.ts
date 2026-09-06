import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

export interface IGTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "ref"> {
  label?: string;
  error?: string;
  hint?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  endAction?: ReactNode;
  size?: SizeEnum;
  ref?: Ref<HTMLInputElement>;
}

