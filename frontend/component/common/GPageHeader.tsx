import { cn } from "@/lib/cn";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { GIcon } from "./GIcon";
import { GCard } from "./GCard";

import type { IGPageHeaderProps } from "./def/GPageHeader";

function GPageHeader({ icon, title, subtitle, badge, className }: IGPageHeaderProps) {
  return (
    <GCard className={cn("mb-5", className)}>
      <header className="flex items-center gap-3">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-muted">
          <GIcon icon={icon} size={SizeEnum.lg} color={AccentColorEnum.Primary} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-text truncate">{title}</h1>
          </div>
          {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </header>
    </GCard>
  );
}

export { GPageHeader };
