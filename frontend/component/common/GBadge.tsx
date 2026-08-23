import { cn } from "@/lib/cn";
import type { IGBadgeProps } from "./def/GBadge";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { accentBg } from "@/domain/constant/accent-bg";

const badgeBase = "inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-0.5 whitespace-nowrap";

function GBadge({ variant = AccentColorEnum.Primary, size = SizeEnum.md, className, children, ...props }: IGBadgeProps) {
  return (
    <span
      className={cn(
        badgeBase,
        accentBg[variant],
        (size === SizeEnum.xs || size === SizeEnum.sm) && "text-2xs",
        variant === AccentColorEnum.Secondary && "border border-border",
        className,
      )}
      {...props}>
      {children}
    </span>
  );
}

export { GBadge };
