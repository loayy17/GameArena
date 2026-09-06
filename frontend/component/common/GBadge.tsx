import { cn } from "@/lib/cn";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { accentBg } from "@/domain/constant/style-tokens";

import type { IGBadgeProps } from "./def/GBadge";

const badgeBase = "inline-flex items-center gap-1 text-xs font-semibold rounded-full py-0.5 whitespace-nowrap";

function GBadge({
  count,
  variant = AccentColorEnum.Primary,
  size = count != null ? SizeEnum.sm : SizeEnum.md,
  className,
  children,
  ...props
}: IGBadgeProps) {
  if (count != null && count <= 0) return null;

  return (
    <span
      className={cn(
        badgeBase,
        count != null ? "px-1" : "px-2.5",
        variant,
        accentBg[variant],
        (size === SizeEnum.xs || size === SizeEnum.sm) && "text-2xs",
        variant === AccentColorEnum.Secondary && "border border-border",
        count != null && "min-w-5 justify-center leading-none tabular-nums",
        className,
      )}
      {...props}>
      {count != null ? (count > 99 ? "99+" : count) : children}
    </span>
  );
}

export { GBadge };
