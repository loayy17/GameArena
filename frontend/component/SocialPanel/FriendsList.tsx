"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Gamepad2 } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { GStatusDot } from "../common/GStatusDot";
import { GNav } from "../common/GNav";
import { GIcon } from "../common/GIcon";
import { GAvatar } from "../common/GAvatar";
import { GButton } from "../common/GButton";
import { GCard } from "../common/GCard";
import type { IFriendsListProps } from "./def/FriendsList";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

export function FriendsList({ friends, messageLabel, query, activeLabel, actions }: IFriendsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentActiveFriendId = searchParams.get("friend");
  const isCurrentChat = (friendId: string) => currentActiveFriendId === friendId;
  const searchRegex = useMemo(() => {
    if (!query?.trim()) return null;
    try {
      return new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    } catch {
      return null;
    }
  }, [query]);

  const renderHighlightedName = (friend: IUserSummary) => {
    if (!searchRegex || !query) {
      return friend.fullName;
    }

    return friend?.fullName?.split(searchRegex).map((part, index) => {
      const isMatch = part.toLowerCase() === query.toLowerCase();

      return isMatch ? (
        <span key={`${friend.id}-match-${index}`} className="bg-warning text-bg px-1 rounded">
          {part}
        </span>
      ) : (
        <span key={`${friend.id}-part-${index}`}>{part}</span>
      );
    });
  };

  return (
    <GNav orientation="vertical">
      {friends.map((friend) => (
        <GCard key={friend.id} padding="sm" variant="outlined" rounded="xl" className="flex items-center gap-3">
          <div className="relative shrink-0">
            <GAvatar
              firstName={friend.firstName}
              lastName={friend.lastName}
              userName={friend.userName}
              size="sm"
              shape="circle"
            />
            <GStatusDot status={friend.status} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-inherit">{renderHighlightedName(friend)}</h3>

            <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
              <span>@{friend.userName}</span>
              {friend.status === UserStatusEnum.InGame && (
                <>
                  <span>•</span>
                  <GIcon icon={Gamepad2} size="xs" color="primary" />
                </>
              )}
            </div>
          </div>

          {!actions && (
            <GButton
              variant={isCurrentChat(friend.id) ? "ghost" : "secondary"}
              size="sm"
              disabled={isCurrentChat(friend.id)}
              onClick={() => router.push(`/messages?friend=${friend.id}`)}
              className="shrink-0">
              {isCurrentChat(friend.id) ? activeLabel : messageLabel}
            </GButton>
          )}
          {actions && <div className="flex gap-2">{actions(friend)}</div>}
        </GCard>
      ))}
    </GNav>
  );
}
