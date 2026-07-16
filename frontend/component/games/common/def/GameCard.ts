import type { LucideIcon } from "lucide-react";

interface GameCardProps {
  name: string;
  desc: string;
  icon?: LucideIcon;
  iconColor?: string;
  gradient?: string;
  animation?: string;
  onClick: () => void;
  playLabel: string;
}

export type { GameCardProps };
