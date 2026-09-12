"use client";

import { useState } from "react";
import { Check, UserCheck, X } from "lucide-react";

import { GConfirmDialog } from "@/component/common/GConfirmDialog";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { FriendsList } from "../social/FriendsList";

import type { IUserSummary } from "@/domain/meta/IUserSummary";
import type { IRequestsTabProps } from "./def/FriendsTab";

function RequestsTab({ requests, onAccept, onDecline, t }: IRequestsTabProps) {
  const [pendingDecline, setPendingDecline] = useState<string | null>(null);

  if (requests.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={UserCheck} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
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
    fullName: r.senderFullName || r.senderUserName || r.senderId,
  }));

  return (
    <>
      <FriendsList
        friends={friends}
        actions={(friend) => (
          <div className="flex gap-1">
            <GButton icon={Check} label={t.requestsTab.accept} tone="success" onClick={() => onAccept(friend.id)} />
            <GButton icon={X} label={t.requestsTab.decline} tone="danger" onClick={() => setPendingDecline(friend.id)} />
          </div>
        )}
      />
      <GConfirmDialog
        open={!!pendingDecline}
        icon={X}
        iconColor={AccentColorEnum.Danger}
        title={t.confirm.cancelTitle}
        description={t.confirm.cancelDesc}
        confirmLabel={t.confirm.confirm}
        cancelLabel={t.confirm.cancel}
        onClose={() => setPendingDecline(null)}
        onConfirm={() => {
          if (pendingDecline) onDecline(pendingDecline);
          setPendingDecline(null);
        }}
      />
    </>
  );
}

export { RequestsTab };
