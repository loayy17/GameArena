export interface GSelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

import type { GSize } from "../tokens";

export interface GSelectProps<TValue extends string | number = string>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  options: GSelectOption<TValue>[];
  placeholder?: string;
  size?: GSize;
}
