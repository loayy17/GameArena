"use client";

import { useState } from "react";
import { Users, MessageSquare, ShieldBan, UserMinus, Loader2 } from "lucide-react";
import { FriendsList } from "../SocialPanel/FriendsList";
import { GButton } from "../common/GButton";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "../common/GIcon";
import { GIconTile } from "../common/GIconTile";
import type { FriendsListTabProps } from "./def/FriendsTab";
import type { TNullable } from "@/domain/type/TCommon";

function FriendsListTab({ friends, messageLabel, activeLabel, onMessage, onBlock, onRemove, onAddFriend, t }: FriendsListTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (friends.length === 0) {
    return (
      <GEmpty icon={<GIcon icon={Users} size="xl" color="muted" />} title={t.noFriendsTitle} description={t.noFriendsDescription}>
        <GButton onClick={onAddFriend} className="mt-4">{t.addFriend}</GButton>
      </GEmpty>
    );
  }

  return (
    <FriendsList
      friends={friends}
      messageLabel={messageLabel}
      activeLabel={activeLabel}
      actions={(friend) => {
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-1">
            <GIconTile icon={MessageSquare} size="sm" gradient="text-primary" className="hover:bg-primary hover:text-text" onClick={() => onMessage(friend.id)} />
            <GIconTile icon={isBusy ? Loader2 : ShieldBan} size="sm" gradient="text-warning" className={isBusy ? "animate-spin opacity-50 pointer-events-none" : "hover:bg-warning hover:text-text"}
              onClick={async () => {
                setActionId(friend.id);
                try { await onBlock(friend.id); } finally { setActionId(null); }
              }} />
            <GIconTile icon={isBusy ? Loader2 : UserMinus} size="sm" gradient="text-danger" className={isBusy ? "animate-spin opacity-50 pointer-events-none" : "hover:bg-danger hover:text-text"}
              onClick={async () => {
                setActionId(friend.id);
                try { await onRemove(friend.id); } finally { setActionId(null); }
              }} />
          </div>
        );
      }}
    />
  );
}

export { FriendsListTab };
