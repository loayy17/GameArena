"use client";

import { useState } from "react";
import { Loader2, Send, X } from "lucide-react";
import { FriendsList } from "../SocialPanel/FriendsList";
import { GEmpty } from "../common/GEmpty";
import { GIcon } from "../common/GIcon";
import { GIconTile } from "../common/GIconTile";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import type { SentRequestsTabProps } from "./def/FriendsTab";
import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { TNullable } from "@/domain/type/TCommon";

function SentRequestsTab({ sentRequests, onCancel, t }: SentRequestsTabProps) {
  const [actionId, setActionId] = useState<TNullable<string>>(null);

  if (sentRequests.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={Send} size="xl" color="muted" />}
        title={t.sentTab.emptyTitle}
        description={t.sentTab.emptyDescription}
      />
    );
  }

  const friends: IUserSummary[] = sentRequests.map((r) => ({
    id: r.receiverId,
    firstName: r.receiverFirstName,
    lastName: r.receiverLastName,
    userName: r.receiverUserName,
    fullName: [r.receiverFirstName, r.receiverLastName].filter(Boolean).join(" ") || r.receiverUserName || r.receiverId,
    status: UserStatusEnum.Offline,
  }));

  return (
    <FriendsList
      friends={friends}
      messageLabel={t.message}
      activeLabel={t.message}
      actions={(friend) => {
        const isBusy = actionId === friend.id;
        return (
          <div className="flex gap-3">
            <GIconTile icon={isBusy ? Loader2 : X} size="sm" gradient="text-danger" className={isBusy ? "animate-spin opacity-50 pointer-events-none" : ""}
              onClick={async () => {
                setActionId(friend.id);
                try { await onCancel(friend.id); } finally { setActionId(null); }
              }} />
          </div>
        );
      }}
    />
  );
}

export { SentRequestsTab };
