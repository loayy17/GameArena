import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";

interface IGNavItem {
  id: string;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface IGNavProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  items: IGNavItem[];
  orientation?: NavOrientationEnum;
  collapsed?: boolean;
  stacked?: boolean;
  className?: string;
}

export type { IGNavProps, IGNavItem };
