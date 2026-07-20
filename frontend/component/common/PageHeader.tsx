import clsx from "clsx";
import type { ReactNode } from "react";
import { GIcon } from "./GIcon";
import { GCard } from "./GCard";
import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon: LucideIcon;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  className?: string;
}

function PageHeader({ icon, title, subtitle, badge, className }: PageHeaderProps) {
  return (
    <GCard padding="md" className={clsx("mb-5", className)}>
      <header className="flex items-center gap-3">
        <GIcon icon={icon} size="xl" tile tileSize="xl" tileGradient="bg-primary" tileColor="on-primary" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-extrabold text-text tracking-tight leading-tight truncate">{title}</h1>
            {badge && <div className="mb-1 shrink-0">{badge}</div>}
          </div>
          {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
        </div>
      </header>
    </GCard>
  );
}

export { PageHeader };
