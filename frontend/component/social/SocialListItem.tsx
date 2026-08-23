"use client";

import { GAvatar } from "@/component/common/GAvatar";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

interface ISocialListItemProps {
  firstName?: string | null;
  lastName?: string | null;
  userName?: string | null;
  status?: UserStatusEnum;
  onClick?: () => void;
}

function SocialListItem({ firstName, lastName, userName, status, onClick }: ISocialListItemProps) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-start hover:bg-surface">
      <GAvatar firstName={firstName} lastName={lastName} size={SizeEnum.sm} status={status} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">
          {firstName} {lastName}
        </p>
        {userName && <p className="truncate text-xs text-text-muted">@{userName}</p>}
      </div>
    </button>
  );
}

export { SocialListItem };
