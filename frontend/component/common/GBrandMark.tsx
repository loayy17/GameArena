"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";
import { focusRing } from "@/domain/constant/style-tokens";

import { GBrandText } from "./GBrandText";
import { GTooltip } from "./GTooltip";

import type { IGBrandMarkProps } from "./def/GBrandMark";

function GBrandMark({ name, href, onClick, className, tooltip }: IGBrandMarkProps) {
  const content = (
    <>
      <Image src="/arena404_badge.png" alt="" width={32} height={32} className="size-8 shrink-0 rounded-lg object-contain" priority />
      <GBrandText name={name} className="truncate text-lg font-bold text-text" />
    </>
  );

  const classes = cn("flex shrink-0 min-w-0 cursor-pointer items-center gap-2.5 rounded-lg", focusRing, className);

  let mark: React.ReactNode;
  if (href || onClick) {
    mark = (
      <Link
        href={href ?? "/home"}
        aria-label={name}
        onClick={onClick}
        className={classes}>
        {content}
      </Link>
    );
  } else {
    mark = (
      <div className={cn("flex min-w-0 items-center gap-2.5", className)}>
        {content}
      </div>
    );
  }

  if (tooltip) {
    return <GTooltip content={tooltip} side="bottom">{mark}</GTooltip>;
  }
  return mark;
}

export { GBrandMark };
