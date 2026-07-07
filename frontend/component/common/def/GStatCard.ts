import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { GSize } from "../tokens";

interface GStatCardProps {
  label: string;
  value: ReactNode;
  icon: LucideIcon;
  iconColor?: "primary" | "success" | "warning" | "danger" | "muted";
  size?: GSize;
}

export type { GStatCardProps };
