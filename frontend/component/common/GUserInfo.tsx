"use client";

import clsx from "clsx";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { GAvatar } from "./GAvatar";
import type { IGUserInfoProps } from "./def/GUserInfo";

function GUserInfo({ firstName, lastName, userName, avatarUrl, status, avatarSize = SizeEnum.sm, className }: IGUserInfoProps) {
  return (
    <div className={clsx("flex items-center gap-3 min-w-0", className)}>
      <GAvatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} status={status} size={avatarSize} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">
          {firstName} {lastName}
        </p>
        {userName && <p className="truncate text-xs text-text-secondary">@{userName}</p>}
      </div>
    </div>
  );
}

export { GUserInfo };
