"use client";

import { useState } from "react";
import { Loader2, ShieldBan } from "lucide-react";
import { FriendsList } from "../SocialPanel/FriendsList";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "../common/GIcon";
import type { BlockedUsersTabProps } from "./def/FriendsTab";
import type { TNullable } from "@/domain/type/TCommon";

function BlockedUsersTab({ blockedUsers, onUnblock, t }: BlockedUsersTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (blockedUsers.length === 0) {
    return (
      <GEmpty icon={<GIcon icon={ShieldBan} size="xl" color="muted" />} title={t.blockedTab.emptyTitle} description={t.blockedTab.emptyDescription} />
    );
  }

  return (
    <FriendsList
      friends={blockedUsers}
      messageLabel={t.message}
      activeLabel={t.message}
      actions={(friend) => {
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-1">
            <GIcon icon={isBusy ? Loader2 : ShieldBan} size="sm" tile tileSize="sm" tileGradient="bg-success/10" tileColor="success" className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try { await onUnblock(friend.id); } finally { setActionId(null); }
              }}
            />
          </div>
        );
      }}
    />
  );
}

export { BlockedUsersTab };
