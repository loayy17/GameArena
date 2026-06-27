"use client";

import clsx from "clsx";
import type { TBadgeProps } from "./def/TBadge";

function TBadge({
  count = 0,
  className,
  max = 99,
  showZero = false,
  children,
}: TBadgeProps) {
  if (!showZero && count <= 0 && !children) return null;

  const label = children ?? (count > max ? `${max}+` : count.toString());

  return (
    <span
      className={clsx(
        "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none",
        "bg-rose-500 text-white shadow-sm shadow-rose-500/25",
        className,
      )}
    >
      {label}
    </span>
  );
}

export { TBadge };
