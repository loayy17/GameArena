interface ITTextFieldProps {
  label: string;
  value: string;
  className?: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}

export type { ITTextFieldProps };
