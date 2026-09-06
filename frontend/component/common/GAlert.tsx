import { cn } from "@/lib/cn";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import type { IGAlertProps } from "./def/GAlert";

const alertStyles: Record<string, string> = {
  [AccentColorEnum.Primary]: "bg-primary-muted border-primary/30",
  [AccentColorEnum.Secondary]: "bg-secondary-muted border-secondary/30",
  [AccentColorEnum.Muted]: "bg-surface border-border",
  [AccentColorEnum.Success]: "bg-success-muted border-success/30",
  [AccentColorEnum.Warning]: "bg-warning-muted border-warning/30",
  [AccentColorEnum.Danger]: "bg-danger-muted border-danger/30",
  [AccentColorEnum.Accent]: "bg-accent-muted border-accent/30",
};

function GAlert({ severity = AccentColorEnum.Danger, icon, children, className }: IGAlertProps) {
  return (
    <div role="alert" className={cn("flex items-start gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm text-text animate-scale-in", alertStyles[severity], className)}>
      {icon && <span className="shrink-0 translate-y-0.5">{icon}</span>}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export { GAlert };
