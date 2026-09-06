"use client";

import { Frown, UserPlus } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { GList } from "@/component/common/GList";
import { GAsync } from "@/component/common/GAsync";
import { GEmpty } from "@/component/common/GEmpty";
import { GModal } from "@/component/common/GModal";
import { GIcon } from "@/component/common/GIcon";
import { GSearchField } from "@/component/common/GSearchField";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

import type { IInviteModalProps } from "./def/InviteModal";

function InviteModal({
  open,
  searchQuery,
  onSearchChange,
  loading,
  friends,
  onSelect,
  onClose,
  title,
  cancelLabel,
  searchPlaceholder,
  noFriendsText,
  pendingId,
}: IInviteModalProps) {
  return (
    <GModal open={open} onClose={onClose} side="center" size={SizeEnum.md}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <GButton onClick={onClose} variant={ButtonVariantEnum.Subtle} size={SizeEnum.sm}>
          {cancelLabel}
        </GButton>
      </div>
      <GSearchField
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
      />
      <GAsync loading={loading} spinnerSize={SizeEnum.sm} className="mt-3 max-h-40 overflow-y-auto custom-scrollbar">
        {friends.length > 0 ? (
          <GList items={friends} keyExtractor={(friend) => friend.id} pageSize={10} listClassName="gap-1">
            {(friend) => (
              <GButton
                key={friend.id}
                variant={ButtonVariantEnum.Subtle}
                className="justify-start text-sm w-full"
                disabled={pendingId !== null}
                startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} />}
                onClick={() => onSelect(friend.id)}>
                {friend.fullName ?? friend.userName}
              </GButton>
            )}
          </GList>
        ) : (
          <GEmpty icon={<GIcon icon={Frown} size={SizeEnum.lg} color={AccentColorEnum.Muted} />} title={noFriendsText} className="py-4" />
        )}
      </GAsync>
    </GModal>
  );
}

export { InviteModal };
