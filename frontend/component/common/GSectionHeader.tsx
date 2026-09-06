import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/cn";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { GIcon } from "./GIcon";
import { GButton } from "./GButton";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

import type { IGSectionHeaderProps } from "./def/GSectionHeader";

function GSectionHeader({ icon, title, actionHref, actionLabel, onAction, className }: IGSectionHeaderProps) {
  const actionContent = actionLabel && (
    <>
      {actionLabel}
      <GIcon icon={ArrowRight} size={SizeEnum.xs} color={AccentColorEnum.Primary} flip />
    </>
  );

  return (
    <div className={cn("flex items-center justify-between gap-3 mb-4", className)}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-muted">
          <GIcon icon={icon} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
        </div>
        <h2 className="text-xl font-bold text-text truncate">{title}</h2>
      </div>

      {actionHref && actionLabel ? (
        <Link href={actionHref} className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover shrink-0">
          {actionContent}
        </Link>
      ) : onAction && actionLabel ? (
        <GButton variant={ButtonVariantEnum.Subtle} size={SizeEnum.sm} onClick={onAction} className="shrink-0 text-xs font-semibold text-primary hover:text-primary-hover">
          {actionContent}
        </GButton>
      ) : null}
    </div>
  );
}

export { GSectionHeader };
