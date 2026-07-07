import type { ButtonHTMLAttributes, ReactNode } from "react";

type GNavIndicator = "start" | "end" | "top" | "bottom" | "none";

interface GNavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  indicator?: GNavIndicator;
  icon?: ReactNode;
  label?: ReactNode;
  badge?: ReactNode;
  collapsed?: boolean;
}

interface GNavProps {
  children: ReactNode;
  className?: string;
  orientation?: "vertical" | "horizontal";
}

export type { GNavIndicator, GNavItemProps, GNavProps };
