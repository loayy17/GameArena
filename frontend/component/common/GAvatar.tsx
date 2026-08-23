"use client";

import { cn } from "@/lib/cn";

import { squareSize } from "@/domain/constant/size-classes";
import { statusColor } from "@/domain/constant/status-color";
import type { IGAvatarProps } from "./def/GAvatar";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { apiBase } from "@/app/network";
import Image from "next/image";

const imageSizes: Partial<Record<SizeEnum, string>> = {
  [SizeEnum.xs]: "32px",
  [SizeEnum.sm]: "48px",
  [SizeEnum.md]: "64px",
  [SizeEnum.lg]: "80px",
  [SizeEnum.xl]: "112px",
};

function GAvatar({ firstName, lastName, avatarUrl, size = SizeEnum.xs, status = UserStatusEnum.All, className }: IGAvatarProps) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();
  const fullUrl = avatarUrl ? `${apiBase}${avatarUrl}` : null;

  return (
    <div className={cn("relative inline-flex shrink-0", fullUrl ? cn(squareSize[size], "rounded-full overflow-hidden") : "", className)}>
      {fullUrl ? (
        <Image
          src={fullUrl}
          alt={`${firstName ?? ""} ${lastName ?? ""}`.trim() || "avatar"}
          fill
          sizes={imageSizes[size] ?? "64px"}
          className="object-cover"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/80 to-primary font-bold text-on-primary",
            squareSize[size],
            "rounded-full",
          )}>
          {initials}
        </div>
      )}

      {status !== UserStatusEnum.All && (
        <span className={cn("absolute bottom-0 end-0 size-2.5 rounded-full border-2 border-bg", statusColor[status])} />
      )}
    </div>
  );
}

export { GAvatar };
