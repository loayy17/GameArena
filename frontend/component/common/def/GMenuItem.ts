import type { MouseEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

interface IGMenuItemProps {
  label: string;
  icon?: LucideIcon;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  selected?: boolean;
  children?: ReactNode;
  className?: string;
}

export type { IGMenuItemProps };
