"use client";

import clsx from "clsx";
import type { GAvatarProps } from "./def/GAvatar";
import { squareSize } from "@/domain/constant/square-size";
import { statusColor } from "@/domain/constant/status-color";

function GAvatar({ firstName, lastName, size = "xs", shape = "circle", status, className }: GAvatarProps) {
  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase();
  const avatarShape = shape === "circle" ? "rounded-full" : "rounded-[var(--radius-md)]";
  const avatarClassName = clsx(
    "relative flex shrink-0 items-center justify-center overflow-hidden bg-primary",
    "font-bold text-text",
    squareSize[size],
    avatarShape,
  );
  return (
    <div className={clsx("inline-flex shrink-0", className)}>
      <div className={avatarClassName}>{initials}</div>
      {status && <span className={clsx("absolute bottom-0 right-0 size-2.5", "rounded-full border-2 border-bg", statusColor[status])} />}
    </div>
  );
}

export { GAvatar };
