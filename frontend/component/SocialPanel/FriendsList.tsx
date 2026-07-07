"use client";

import { Gamepad2 } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { IFriend } from "@/domain/meta/ICommon";
import { GTile } from "../common/GTile";
import { GStatusDot } from "../common/GStatusDot";
import { GNav, GNavItem } from "../common/GNav";
import { GIcon } from "../common/GIcon";

interface IFriendsListProps {
  friends: IFriend[];
  onSelectFriend: (id: string) => void;
  activeId?: string | null;
  indicator?: "start" | "end" | "top" | "bottom" | "none";
}

export function FriendsList({
  friends,
  onSelectFriend,
  activeId,
  indicator = "start",
}: IFriendsListProps) {
  return (
    <GNav orientation="vertical">
      {friends.map((friend) => (
        <GNavItem
          key={friend.id}
          active={friend.id === activeId}
          indicator={indicator}
          onClick={() => onSelectFriend(friend.id)}
          icon={
            <span className="relative shrink-0">
              <GTile user={friend} size="sm" />
              <GStatusDot status={friend.status} />
            </span>
          }
          label={
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-inherit">
                {friend.firstName} {friend.lastName}
              </span>
              <span className="flex items-center gap-1 truncate text-xs text-text-muted">
                {friend.status === UserStatusEnum.InGame && (
                  <GIcon icon={Gamepad2} size="xs" color="primary" />
                )}
                @{friend.userName}
              </span>
            </span>
          }
        />
      ))}
    </GNav>
  );
}
