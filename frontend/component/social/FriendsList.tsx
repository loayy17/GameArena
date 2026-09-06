"use client";

import { UsersRound } from "lucide-react";

import { GUserRow } from "@/component/user/GUserRow";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { GCard } from "../common/GCard";
import { GList } from "../common/GList";
import { GIcon } from "../common/GIcon";

import type { IFriendsListProps } from "./def/FriendsList";

function FriendsList({ friends, query, unreadCounts, actions }: IFriendsListProps) {
  return (
    <GCard className="p-0">
      <GList
        items={friends}
        keyExtractor={(friend) => friend.id}
        listClassName="divide-y divide-border/60"
        emptyIcon={<GIcon icon={UsersRound} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}>
        {(friend) => (
          <GUserRow
            user={friend}
            query={query ?? undefined}
            unreadCount={unreadCounts?.[friend.id]}
            className="px-4 py-3"
            trailing={actions(friend)}
            href={`/profile/${friend.id}`}
          />
        )}
      </GList>
    </GCard>
  );
}

export { FriendsList };
