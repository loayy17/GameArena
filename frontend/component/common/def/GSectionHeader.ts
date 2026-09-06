import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export interface IGSectionHeaderProps {
  icon: LucideIcon;
  title: ReactNode;
  actionHref?: string;
  actionLabel?: ReactNode;
  onAction?: () => void;
  className?: string;
}
