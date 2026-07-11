"use client";

import { Users } from "lucide-react";
import { FriendCard } from "@/component/friend/FriendCard";
import { GEmpty } from "@/component/common/GEmpty";
import { GCard } from "../common/GCard";
import { GIcon } from "../common/GIcon";
import { GButton } from "../common/GButton";
import { GSkeleton } from "../common/GSkeleton";
import { useTranslation } from "@/hooks/useSetting";
import { useFriendList } from "@/hooks/useFriends";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";
import type { FriendsTabProps } from "./def/FriendsTab";

function FriendsTab({ onMessage, onInvite, onNavigateToSearch }: FriendsTabProps) {
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const { friends, loading } = useFriendList();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <GCard key={i} padding="md" className="flex flex-col items-center">
            <GSkeleton variant="rect" className="w-16 h-16 mb-2" />
            <GSkeleton variant="text" className="w-24 mb-1" />
            <GSkeleton variant="text" className="w-16 mb-4" />
            <div className="flex gap-2 w-full">
              <GSkeleton variant="rect" className="flex-1 h-9" />
              <GSkeleton variant="rect" className="flex-1 h-9" />
            </div>
          </GCard>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <GEmpty icon={<GIcon icon={Users} size="xl" color="muted" />} title={t.noFriendsTitle} description={t.noFriendsDescription}>
        <GButton onClick={onNavigateToSearch} className="mt-4">
          {t.addFriend}
        </GButton>
      </GEmpty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {friends.map((friend) => (
        <FriendCard key={friend.id} user={friend} onMessage={() => onMessage(friend.id)} onInvite={() => onInvite(friend.id)} />
      ))}
    </div>
  );
}

export { FriendsTab };
