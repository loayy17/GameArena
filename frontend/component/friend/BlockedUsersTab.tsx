"use client";

import { useState } from "react";
import { ShieldBan } from "lucide-react";
import { FriendsList } from "../SocialPanel/FriendsList";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "../common/GIcon";
import { GIconTile } from "../common/GIconTile";
import type { BlockedUsersTabProps } from "./def/FriendsTab";
import type { TNullable } from "@/domain/type/TCommon";

function BlockedUsersTab({ blockedUsers, onUnblock, t }: BlockedUsersTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (blockedUsers.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={ShieldBan} size="xl" color="muted" />}
        title={t.blockedTab.emptyTitle}
        description={t.blockedTab.emptyDescription}
      />
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
            <GIconTile icon={ShieldBan} size="sm" gradient="text-success" className={isBusy ? "opacity-50 pointer-events-none" : ""}
              onClick={() => {
                setActionId(friend.id);
                onUnblock(friend.id);
                setActionId(null);
              }} />
          </div>
        );
      }}
    />
  );
}

export { BlockedUsersTab };
