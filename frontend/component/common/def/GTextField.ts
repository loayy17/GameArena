import type { InputHTMLAttributes, ReactNode } from "react";

export interface GTextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
