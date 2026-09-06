"use client";

import { useMemo, useState } from "react";
import { MessagesSquare } from "lucide-react";

import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { GSearchField } from "@/component/common/GSearchField";
import { GUserRow } from "@/component/user/GUserRow";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { filterUsersByTerm } from "@/domain/lib/userUtils";

import type { IFriendListProps } from "./def/FriendList";

function FriendList({ friends, loading, selectedFriendId, unreadCounts, onSelect, t }: IFriendListProps) {
  const [query, setQuery] = useState("");
  const filteredFriends = useMemo(() => filterUsersByTerm(friends, query), [friends, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="space-y-4 border-b border-border p-4">
        <GSearchField
          id="friend-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
        />
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto p-4">
        <GAsync loading={loading} spinnerSize={SizeEnum.lg} className="py-10">
          {filteredFriends.length === 0 ? (
            <GEmpty
              icon={<GIcon icon={MessagesSquare} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
              title={t.noFriendsTitle}
              description={t.noFriendsDescription}
            />
          ) : (
            <div className="space-y-1">
              {filteredFriends.map((friend) => (
                <GUserRow
                  key={friend.id}
                  user={friend}
                  href={`/profile/${friend.id}`}
                  active={friend.id === selectedFriendId}
                  unreadCount={unreadCounts[friend.id]}
                  className="p-1"
                  trailing={
                    <GButton
                      icon={MessagesSquare}
                      label={t.message}
                      tone={friend.id === selectedFriendId ? "primary" : "muted"}
                      onClick={() => onSelect(friend.id)}
                      size={SizeEnum.sm}
                    />
                  }
                />
              ))}
            </div>
          )}
        </GAsync>
      </div>
    </div>
  );
}

export { FriendList };
