"use client";

import { useCallback, useEffect, useState } from "react";
import { Users, RefreshCw } from "lucide-react";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { friendService } from "@/services/def/FriendService";
import { FriendCard } from "@/component/friend/FriendCard";
import { EmptyState } from "@/component/common/TEmpty";
import { SkeletonCard } from "./SkeletonCard";
import type { IUser } from "@/domain/meta/IUser";
import { TButton } from "../common/TButton";

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
  const [friends, setFriends] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFriends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await friendService.getFriends({
        name: null,
        userStatus: UserStatusEnum.All,
      });

      setFriends(response.data ?? []);
    } catch (err) {
      console.error("Failed to load friends", err);
      setError("Failed to load friends. Please try again.");
      setFriends([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const response = await friendService.getFriends({
          name: null,
          userStatus: UserStatusEnum.All,
        });

        if (!active) return;
        setFriends(response.data ?? []);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load friends", err);
        setError("Failed to load friends. Please try again.");
        setFriends([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-5 text-rose-200">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">{error}</p>
          <TButton
            onClick={() => void loadFriends()}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 px-3 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-500/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </TButton>
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-12 w-12 text-text-muted" />}
        title="No friends yet"
        description="Search for users and add them as friends."
      >
        <TButton
          onClick={onNavigateToSearch}
          className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-text transition hover:bg-primary-hover"
        >
          Add Friends
        </TButton>
      </EmptyState>
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
