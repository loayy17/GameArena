"use client";

import clsx from "clsx";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { GStatusDotProps } from "./def/GStatusDot";
import { rounded } from "./tokens";

const statusColor: Record<UserStatusEnum, string> = {
  [UserStatusEnum.Offline]: "bg-text-muted",
  [UserStatusEnum.Online]: "bg-success",
  [UserStatusEnum.InGame]: "bg-neon-cyan",
  [UserStatusEnum.All]: "bg-text-muted",
};

function GStatusDot({ status, className }: GStatusDotProps) {
  return (
    <span
      className={clsx(
        "absolute -bottom-px -end-px h-2.5 w-2.5 border-2 border-bg-sidebar",
        rounded.full,
        status !== undefined ? statusColor[status] : "bg-text-muted",
        className,
      )}
      aria-hidden
    />
  );
}

export { GStatusDot };
