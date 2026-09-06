import type { MouseEvent, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

interface IGMenuItemProps {
  label: string;
  icon?: LucideIcon;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  disabled?: boolean;
  variant?: ButtonVariantEnum;
  children?: ReactNode;
  className?: string;
}

export type { IGMenuItemProps };
