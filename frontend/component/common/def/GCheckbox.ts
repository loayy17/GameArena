import type { InputHTMLAttributes, ReactNode, Ref } from "react";

export interface IGCheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "ref"> {
  checked?: boolean;
  label?: ReactNode;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

