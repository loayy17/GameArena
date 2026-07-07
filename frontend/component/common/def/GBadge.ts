import type { HTMLAttributes, ReactNode } from "react";

interface GBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "muted";
  size?: "sm" | "md";
  children: ReactNode;
}

export type { GBadgeProps };
