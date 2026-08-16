"use client";

import clsx from "clsx";

import { squareSize } from "@/domain/constant/size-classes";
import { statusColor } from "@/domain/constant/status-color";
import type { IGAvatarProps } from "./def/GAvatar";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

function GAvatar({ firstName, lastName, size = SizeEnum.xs, avatarUrl, status = UserStatusEnum.All, className }: IGAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  const avatarClassName = clsx(
    "flex shrink-0 items-center justify-center overflow-hidden bg-primary font-bold text-text",
    squareSize[size],
    "rounded-full",
  );

  return (
    <div className={clsx("relative inline-flex shrink-0", className)}>
      <div className={avatarClassName}>{initials}</div>

      {status !== UserStatusEnum.All && (
        <span className={clsx("absolute bottom-0 inset-e-0 size-2.5 rounded-full border-2 border-bg", statusColor[status])} />
      )}
    </div>
  );
}

export { GAvatar };
