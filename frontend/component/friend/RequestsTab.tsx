"use client";

import { useState } from "react";
import { Check, Loader2, UserCheck, X } from "lucide-react";
import { FriendsList } from "../SocialPanel/FriendsList";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "../common/GIcon";
import type { RequestsTabProps } from "./def/FriendsTab";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

function RequestsTab({ requests, onAccept, onDecline, t }: RequestsTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (requests.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={UserCheck} size="xl" color="muted" />}
        title={t.requestsTab.emptyTitle}
        description={t.requestsTab.emptyDescription}
      />
    );
  }

  const friends: IUserSummary[] = requests.map((r) => ({
    id: r.senderId,
    firstName: r.senderFirstName,
    lastName: r.senderLastName,
    userName: r.senderUserName,
    fullName: [r.senderFirstName, r.senderLastName].filter(Boolean).join(" ") || r.senderUserName || r.senderId,
  }));

  return (
    <FriendsList
      friends={friends}
      messageLabel={t.message}
      activeLabel={t.message}
      actions={(friend) => {
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-1">
            <GIcon icon={isBusy ? Loader2 : Check} size="sm" tile tileSize="sm" tileGradient="bg-success/10" tileColor="success" className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try { await onAccept(friend.id); } finally { setActionId(null); }
              }} />
            <GIcon icon={isBusy ? Loader2 : X} size="sm" tile tileSize="sm" tileGradient="bg-danger/10" tileColor="danger" className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try { await onDecline(friend.id); } finally { setActionId(null); }
              }} />
          </div>
        );
      }}
    />
  );
}

export { RequestsTab };
