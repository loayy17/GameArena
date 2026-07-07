/* eslint-disable @next/next/no-img-element */
"use client";

import clsx from "clsx";
import type { GAvatarProps } from "./def/GAvatar";
import { avatarSize, gradient, rounded } from "./tokens";

function GAvatar({
  firstName,
  lastName,
  userName,
  src,
  size = "sm",
  shape = "rounded",
  gradient: gradientProp = "subtle-brand",
  className,
}: GAvatarProps) {
  const initials =
    ((firstName?.charAt(0) ?? "") + (lastName?.charAt(0) ?? "")).toUpperCase() ||
    userName?.charAt(0).toUpperCase() ||
    "?";

  const shapeClass = shape === "circle" ? rounded.full : rounded.md;

  if (src) {
    return (
      <div className={clsx("relative shrink-0", className)}>
        <img
          src={src}
          alt=""
          className={clsx("object-cover", avatarSize[size], shapeClass)}
        />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex shrink-0 items-center justify-center font-bold text-text",
        avatarSize[size],
        shapeClass,
        gradient[gradientProp],
        className,
      )}
    >
      {initials}
    </div>
  );
}

export { GAvatar };
