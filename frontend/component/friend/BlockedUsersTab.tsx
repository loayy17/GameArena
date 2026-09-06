"use client";

import { ShieldBan } from "lucide-react";

import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { FriendsList } from "../social/FriendsList";

import type { IBlockedUsersTabProps } from "./def/FriendsTab";

function BlockedUsersTab({ blockedUsers, onUnblock, t }: IBlockedUsersTabProps) {
  if (blockedUsers.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={ShieldBan} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.blockedTab.emptyTitle}
        description={t.blockedTab.emptyDescription}
      />
    );
  }

  return (
    <FriendsList
      friends={blockedUsers}
      actions={(friend) => <GButton icon={ShieldBan} label={t.blockedTab.unblock} tone="success" onClick={() => onUnblock(friend.id)} />}
    />
  );
}

export { BlockedUsersTab };
