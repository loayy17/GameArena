import type { LucideIcon } from "lucide-react";

export interface IStatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  className?: string;
}
