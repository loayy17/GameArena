import { GCard } from "@/component/common/GCard";
import { GButton } from "@/component/common/GButton";
import { GIconTile } from "@/component/common/GIconTile";
import type { GameCardProps } from "./def/GameCard";

function GameCard({ name, desc, icon, onClick, gradient, playLabel }: GameCardProps) {
  return (
    <GCard padding="lg" className="group overflow-hidden flex flex-col justify-center items-center">
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
