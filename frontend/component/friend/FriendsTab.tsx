"use client";

import { Users } from "lucide-react";
import { FriendCard } from "@/component/friend/FriendCard";
import { GEmpty } from "@/component/common/GEmpty";
import { GButton } from "../common/GButton";
import { GSkeleton } from "../common/GSkeleton";
import { useTranslation } from "@/hooks/useSetting";
import { useFriendList } from "@/hooks/useFriends";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";

interface FriendsTabProps {
  onMessage: (friendId: string) => void;
  onInvite: (friendId: string) => void;
  onNavigateToSearch: () => void;
}

function FriendsTab({
  onMessage,
  onInvite,
  onNavigateToSearch,
}: FriendsTabProps) {
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const { friends, loading, reload } = useFriendList();

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center animate-pulse">
            <GSkeleton variant="rect" className="w-16 h-16 mb-2" />
            <GSkeleton variant="text" className="w-24 mb-1" />
            <GSkeleton variant="text" className="w-16 mb-4" />
            <div className="flex gap-2 w-full">
              <GSkeleton variant="rect" className="flex-1 h-9" />
              <GSkeleton variant="rect" className="flex-1 h-9" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <GEmpty
        icon={<Users className="h-12 w-12 text-text-muted" />}
        title={t.noFriendsTitle}
        description={t.noFriendsDescription}
      >
        <GButton onClick={onNavigateToSearch} className="mt-4">
          {t.addFriend}
        </GButton>
      </GEmpty>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {friends.map((friend) => (
        <FriendCard
          key={friend.id}
          user={friend}
          onMessage={() => onMessage(friend.id)}
          onInvite={() => onInvite(friend.id)}
        />
      ))}
    </div>
  );
}

export { FriendsTab };
