/* eslint-disable @next/next/no-img-element */
"use client";

import clsx from "clsx";
import { getNearPrimaryColor } from "@/lib/getNearPrimaryColor";
import type { GAvatarProps } from "./def/GAvatar";

const avatarSize: Record<string, string> = {
  xs: "w-8 h-8 min-w-8 text-xs",
  sm: "w-10 h-10 min-w-10 text-sm",
  md: "w-16 h-16 min-w-16 text-lg",
  lg: "w-20 h-20 min-w-20 text-2xl",
  xl: "w-24 h-24 min-w-24 text-3xl",
};

function GAvatar({ firstName, lastName, userName, src, size = "sm", shape = "rounded", gradient, className }: GAvatarProps) {
  const initials = ((firstName?.charAt(0) ?? "") + (lastName?.charAt(0) ?? "")).toUpperCase() || userName?.charAt(0).toUpperCase() || "?";
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-[var(--radius-md)]";
  const seed = `${firstName ?? ""}${lastName ?? ""}${userName ?? ""}` || initials;
  const autoColor = !gradient ? getNearPrimaryColor(seed) : undefined;

  if (src) {
    return (
      <div className={clsx("relative shrink-0", className)}>
        <img src={src} alt="" className={clsx("object-cover", avatarSize[size], shapeClass)} />
      </div>
    );
  }

  return (
    <div
      className={clsx("flex shrink-0 items-center justify-center font-bold text-white", avatarSize[size], shapeClass, gradient, className)}
      style={autoColor ? { backgroundColor: autoColor } : undefined}
    >
      {initials}
    </div>
  );
}

export { GAvatar };
