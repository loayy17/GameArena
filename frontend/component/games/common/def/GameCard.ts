import type { LucideIcon } from "lucide-react";

interface GameCardProps {
  name: string;
  desc: string;
  icon?: LucideIcon;
  iconColor?: string;
  gradientClass?: string;
  animation?: string;
  onClick: () => void;
  playLabel: string;
  page?: boolean;
}

export type { GameCardProps };
