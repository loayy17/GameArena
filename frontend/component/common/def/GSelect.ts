export interface GSelectOption<TValue extends string | number = string> {
  value: TValue;
  label: string;
}

export interface GSelectProps<TValue extends string | number = string>
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children" | "size"> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  options: GSelectOption<TValue>[];
  placeholder?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}
