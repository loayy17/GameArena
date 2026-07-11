import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GIconTile } from "@/component/common/GIconTile";
import type { LucideIcon } from "lucide-react";

interface GameCardProps {
  name: string;
  desc: string;
  icon?: LucideIcon;
  iconColor?: string;
  gradient?: string;
  onClick: () => void;
  playLabel: string;
}

function GameCard({ name, desc, icon, onClick, gradient, playLabel }: GameCardProps) {
  return (
    <GCard padding="lg" className="group overflow-hidden flex flex-col justify-center items-center transition-all duration-300 hover:-translate-y-1">
      {icon && <GIconTile gradient={gradient} size="lg" icon={icon} className="group-hover:animate-bounce" />}
      <h3 className="text-lg font-bold text-text mb-1">{name}</h3>
      <p className="text-xs text-text-secondary mb-4">{desc}</p>
      <GButton variant="secondary" onClick={onClick}>
        {playLabel}
      </GButton>
    </GCard>
  );
}

export { GameCard };
