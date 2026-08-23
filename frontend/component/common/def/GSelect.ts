import type { SelectHTMLAttributes, ReactNode } from "react";
import type { SizeEnum } from "@/domain/enum/SizeEnum";

interface IGSelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

export interface IGSelectProps<TValue extends string | number = string> extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
  options: IGSelectOption<TValue>[];
  placeholder?: string;
  size?: SizeEnum;
}
