import type { HTMLAttributes, ReactNode } from "react";

interface GModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  cardPadding?: "sm" | "md" | "lg";
  role?: "dialog" | "alertdialog";
  ariaLabel?: string;
  ariaDescription?: string;
}

export type { GModalProps };

