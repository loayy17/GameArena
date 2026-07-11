"use client";

import { Frown } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GSpinner } from "@/component/common/GSpinner";
import { GInputSearch } from "@/component/common/GInputSearch";
import { FriendsList } from "@/component/SocialPanel/FriendsList";
import type { IUserSummary } from "@/domain/meta/IUserSummary";

interface InviteModalProps {
  open: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  loading: boolean;
  friends: IUserSummary[];
  onSelect: (friendId: string) => void;
  onClose: () => void;
  title?: string;
  cancelLabel?: string;
  searchPlaceholder?: string;
  noFriendsText?: string;
}

function InviteModal({
  open,
  searchQuery,
  onSearchChange,
  loading,
  friends,
  onSelect,
  onClose,
  title = "Invite a Friend",
  cancelLabel = "Cancel",
  searchPlaceholder = "Search friends...",
  noFriendsText = "No friends found",
}: InviteModalProps) {
  if (!open) return null;

  return (
    <div className="bg-surface/50 border border-border/60 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <GButton onClick={onClose} variant="secondary" size="sm">
          {cancelLabel}
        </GButton>
      </div>
      <GInputSearch
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      <div className="mt-3 max-h-40 overflow-y-auto custom-scrollbar">
        {loading ? (
          <GSpinner size="sm" />
        ) : friends.length > 0 ? (
          <FriendsList friends={friends} onSelectFriend={onSelect} />
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-text-muted text-sm">
            <Frown className="w-6 h-6 mb-1 opacity-50" />
            {noFriendsText}
          </div>
        )}
      </div>
    </div>
  );
}

export { InviteModal };
