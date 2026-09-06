"use client";

import { useState } from "react";
import { Send, X } from "lucide-react";

import { GConfirmDialog } from "@/component/common/GConfirmDialog";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { FriendsList } from "../social/FriendsList";

import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { ISentRequestsTabProps } from "./def/FriendsTab";

function SentRequestsTab({ sentRequests, onCancel, t }: ISentRequestsTabProps) {
  const [pending, setPending] = useState<string | null>(null);

  if (sentRequests.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={Send} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
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
    fullName: r.receiverFullName || [r.receiverFirstName, r.receiverLastName].filter(Boolean).join(" ") || r.receiverUserName || r.receiverId,
  }));

  return (
    <>
      <FriendsList
        friends={friends}
        actions={(friend) => (
          <GButton icon={X} label={t.sentTab.cancel} tone="danger" onClick={() => setPending(friend.id)} />
        )}
      />
      <GConfirmDialog
        open={!!pending}
        icon={X}
        iconColor={AccentColorEnum.Danger}
        title={t.confirm.cancelTitle}
        description={t.confirm.cancelDesc}
        confirmLabel={t.confirm.confirm}
        cancelLabel={t.confirm.cancel}
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (pending) onCancel(pending);
          setPending(null);
        }}
      />
    </>
  );
}

export { SentRequestsTab };
