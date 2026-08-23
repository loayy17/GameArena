"use client";

import { cn } from "@/lib/cn";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, UsersRound } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { GIcon } from "../common/GIcon";
import { GAvatar } from "../common/GAvatar";
import { GBadge } from "../common/GBadge";
import { GCard } from "../common/GCard";
import { GList } from "../common/GList";
import type { IFriendsListProps } from "./def/FriendsList";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

export function FriendsList({ friends, query, unreadCounts, actions }: IFriendsListProps) {
  const router = useRouter();
  const searchRegex = useMemo(() => {
    if (!query?.trim()) return null;
    try {
      return new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi");
    } catch {
      return null;
    }
  }, [query]);

  const renderHighlightedName = (friend: IUserSummary) => {
    const name = friend.fullName ?? ([friend.firstName, friend.lastName].filter(Boolean).join(" ") || friend.userName || "");
    if (!searchRegex || !query) {
      return name;
    }

    return name.split(searchRegex).map((part, index) => {
      const isMatch = part.toLowerCase() === query.toLowerCase();

      return isMatch ? (
        <mark key={`${friend.id}-match-${index}`} className="bg-primary-muted text-primary px-0.5 rounded">
          {part}
        </mark>
      ) : (
        <span key={`${friend.id}-part-${index}`}>{part}</span>
      );
    });
  };

  const openConversation = (friend: IUserSummary) => {
    if (actions) return;
    router.push(`/messages?friend=${friend.id}`);
  };

  return (
    <GCard padding={SizeEnum.None} className="overflow-hidden">
      <GList
        items={friends}
        keyExtractor={(friend) => friend.id}
        listClassName="divide-y divide-border/60"
        emptyIcon={<GIcon icon={UsersRound} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}>
        {(friend) => (
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-3",
              !actions &&
                "cursor-pointer transition-colors hover:bg-bg-card-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
            )}
            onClick={() => openConversation(friend)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !actions) {
                e.preventDefault();
                openConversation(friend);
              }
            }}
            role={!actions ? "button" : undefined}
            tabIndex={!actions ? 0 : undefined}>
            <GAvatar firstName={friend.firstName} lastName={friend.lastName} avatarUrl={friend.avatarUrl} status={friend.status} size={SizeEnum.sm} />

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-text">{renderHighlightedName(friend)}</h3>

              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
                <span className="truncate">@{friend.userName}</span>
                {friend.status === UserStatusEnum.InGame && (
                  <>
                    <span aria-hidden>•</span>
                    <GIcon icon={Gamepad2} size={SizeEnum.xs} color={AccentColorEnum.Primary} />
                  </>
                )}
              </div>
            </div>

            {unreadCounts?.[friend.id] != null && unreadCounts[friend.id] > 0 && (
              <GBadge variant={AccentColorEnum.Danger} size={SizeEnum.sm} className="shrink-0 min-w-5 justify-center">
                {unreadCounts[friend.id]}
              </GBadge>
            )}

            {actions && <div className="flex shrink-0 items-center gap-1">{actions(friend)}</div>}
          </div>
        )}
      </GList>
    </GCard>
  );
}
