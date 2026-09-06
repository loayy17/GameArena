"use client";

import { useState } from "react";
import { MessageSquare, ShieldBan, UserMinus, UserPlus, Users } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { GConfirmDialog } from "@/component/common/GConfirmDialog";
import { GEmpty } from "@/component/common/GEmpty";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { FriendsList } from "../social/FriendsList";

import type { IFriendsListTabProps } from "./def/FriendsTab";

function FriendsListTab({ friends, onMessage, onBlock, onRemove, onAddFriend, t }: IFriendsListTabProps) {
  const [pending, setPending] = useState<{ id: string; action: "block" | "remove" } | null>(null);

  if (friends.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={Users} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
        title={t.noFriendsTitle}
        description={t.noFriendsDescription}>
        <GButton onClick={onAddFriend} className="mt-4" startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} />}>
          {t.addFriend}
        </GButton>
      </GEmpty>
    );
  }

  return (
    <>
      <FriendsList
        friends={friends}
        actions={(friend) => (
          <div className="flex gap-1">
            <GButton icon={MessageSquare} label={t.message} tone="primary" onClick={() => onMessage(friend.id)} />
            <GButton icon={ShieldBan} label={t.actions.block} tone="warning" onClick={() => setPending({ id: friend.id, action: "block" })} />
            <GButton icon={UserMinus} label={t.actions.removeFriend} tone="danger" onClick={() => setPending({ id: friend.id, action: "remove" })} />
          </div>
        )}
      />
      <GConfirmDialog
        open={!!pending}
        icon={pending?.action === "block" ? ShieldBan : UserMinus}
        iconColor={pending?.action === "block" ? AccentColorEnum.Warning : AccentColorEnum.Danger}
        title={pending?.action === "block" ? t.confirm.blockTitle : t.confirm.removeTitle}
        description={pending?.action === "block" ? t.confirm.blockDesc : t.confirm.removeDesc}
        confirmLabel={t.confirm.confirm}
        cancelLabel={t.confirm.cancel}
        onClose={() => setPending(null)}
        onConfirm={() => {
          if (!pending) return;
          const { id, action } = pending;
          setPending(null);
          if (action === "block") onBlock(id);
          else onRemove(id);
        }}
      />
    </>
  );
}

export { FriendsListTab };
