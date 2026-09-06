"use client";

import { useState } from "react";
import Image from "next/image";

import { apiBase } from "@/app/network";
import { cn } from "@/lib/cn";
import { buildFullName } from "@/domain/lib/userUtils";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { squareSize, statusColor } from "@/domain/constant/style-tokens";

import type { IGAvatarProps } from "./def/GAvatar";

const imageSizes: Partial<Record<SizeEnum, string>> = {
  xs: "32px",
  sm: "48px",
  md: "64px",
  lg: "80px",
  xl: "112px",
};

function GAvatar({ user, src, alt, fallback = "", size = SizeEnum.xs, status, className }: IGAvatarProps) {
  const [failed, setFailed] = useState(false);

  const rawSrc = user?.avatarUrl ?? src;
  const avatarSrc = rawSrc ? (rawSrc.startsWith("http") ? rawSrc : `${apiBase}${rawSrc}`) : null;

  const avatarAlt = alt ?? ((user ? user.fullName || buildFullName(user.firstName, user.lastName) : "") || "avatar");

  const avatarFallback = user
    ? `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
    : fallback;

  const avatarStatus = user ? (user.status ?? undefined) : status;

  const showImage = Boolean(avatarSrc) && !failed;
  const showDot = avatarStatus != null && avatarStatus !== UserStatusEnum.All;

  return (
    <div className={cn("relative inline-flex shrink-0", showImage && cn(squareSize[size], "overflow-hidden rounded-full"), className)}>
      {showImage ? (
        <Image
          src={avatarSrc as string}
          alt={avatarAlt}
          fill
          sizes={imageSizes[size] ?? "64px"}
          className="object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary/80 to-primary font-bold text-on-primary",
            squareSize[size],
          )}>
          {avatarFallback}
        </div>
      )}

      {showDot && <span className={cn("absolute bottom-0 end-0 size-2.5 rounded-full border-2 border-bg", statusColor[avatarStatus])} />}
    </div>
  );
}

export { GAvatar, GAvatar as UserAvatar };
