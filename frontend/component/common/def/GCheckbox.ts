import type { InputHTMLAttributes, ReactNode } from "react";

export interface IGCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  checked?: boolean;
  label?: ReactNode;
  error?: string;
}
