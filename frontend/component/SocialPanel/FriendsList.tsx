"use client";

import { Gamepad2 } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { IFriend } from "@/domain/meta/ICommon";
import { GTile } from "../common/GTile";
import { GStatusDot } from "../common/GStatusDot";

interface IFriendsListProps {
  friends: IFriend[];
  onSelectFriend: (id: string) => void;
}

export function FriendsList({ friends, onSelectFriend }: IFriendsListProps) {
  return (
    <div className="space-y-1">
      {friends.map((friend) => (
        <button
          key={friend.id}
          onClick={() => onSelectFriend(friend.id)}
          className="nav-link w-full"
        >
          <div className="relative shrink-0">
            <GTile user={friend} size="sm" />
            <GStatusDot status={friend.status} />
          </div>

          <span className="flex-1 min-w-0 flex items-center gap-1.5 text-left">
            <span className="truncate">
              {friend.firstName} {friend.lastName}
            </span>

            {friend.status === UserStatusEnum.InGame && (
              <Gamepad2 className="w-3.5 h-3.5 text-primary" />
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
