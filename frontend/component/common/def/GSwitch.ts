import type { InputHTMLAttributes, ReactNode, Ref } from "react";

export interface IGSwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "ref"> {
  checked?: boolean;
  label?: ReactNode;
  error?: string;
  ref?: Ref<HTMLInputElement>;
}

