import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loadingText?: string;
  fullWidth?: boolean;
}

export type { GButtonProps };
