import { GCard } from "@/component/common/GCard";
import { GIcon } from "@/component/common/GIcon";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { cn } from "@/lib/cn";

import type { IStatCardProps } from "./def/StatCard";

function StatCard({ icon, label, value, className }: IStatCardProps) {
  return (
    <GCard variant={CardVariantEnum.Elevated} className={cn("flex flex-col items-center gap-1.5 p-4 text-center", className)}>
      <GIcon icon={icon} variant="tile" tone="primary" />
      <p className="text-2xl font-bold leading-none text-text tabular-nums">{value}</p>
      <p className="max-w-full truncate text-2xs font-semibold uppercase tracking-wider text-text-muted">{label}</p>
    </GCard>
  );
}

export { StatCard };
