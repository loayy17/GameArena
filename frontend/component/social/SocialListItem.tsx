"use client";

import clsx from "clsx";
import { GAvatar } from "@/component/common/GAvatar";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { ISocialListItemProps } from "./def/SocialListItem";

function SocialListItem({ firstName, lastName, userName, avatarUrl, status, badge, action, onClick, className }: ISocialListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex items-center gap-3 w-full px-3 py-2 min-w-0",
        "rounded-lg text-start",
        "hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        onClick && "cursor-pointer",
        className,
      )}>
      <div className="relative shrink-0">
        <GAvatar
          firstName={firstName}
          lastName={lastName}
          avatarUrl={avatarUrl}
          status={status as Parameters<typeof GAvatar>[0]["status"]}
          size={SizeEnum.sm}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">
          {firstName} {lastName}
        </p>
        {userName && <p className="truncate text-xs text-text-muted">@{userName}</p>}
      </div>

      {badge && <span className="shrink-0">{badge}</span>}
      {action && <span className="shrink-0">{action}</span>}
    </button>
  );
}

export { SocialListItem };
