import type { ButtonHTMLAttributes, ReactNode } from "react";

interface GButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success" | "link" | "dangerOutline";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
  rounded?: "sm" | "md" | "lg" | "full";
  loadingText?: string;
  fullWidth?: boolean;
  fab?: boolean;
}

export type { GButtonProps };
