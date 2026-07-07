import type { InputHTMLAttributes, ReactNode } from "react";
import type { GSize } from "../tokens";

export interface GTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: GSize;
}
