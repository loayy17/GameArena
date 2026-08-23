"use client";

import { Frown, Search, UserPlus } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GList } from "@/component/common/GList";
import { GAsync } from "@/component/common/GAsync";
import { GModal } from "@/component/common/GModal";
import { GIcon } from "@/component/common/GIcon";
import type { IInviteModalProps } from "./def/InviteModal";
import { GTextField } from "@/component/common/GTextField";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

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
    <GModal open={open} onClose={onClose} side="center" size={SizeEnum.md} cardPadding={SizeEnum.md}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text">{title}</h3>
        <GButton onClick={onClose} variant={ButtonVariantEnum.Subtle} size={SizeEnum.sm}>
          {cancelLabel}
        </GButton>
      </div>
      <GTextField
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={searchPlaceholder}
        startIcon={<GIcon icon={Search} size={SizeEnum.sm} color={AccentColorEnum.Muted} />}
      />
      <GAsync loading={loading} spinnerSize={SizeEnum.sm} className="mt-3 max-h-40 overflow-y-auto custom-scrollbar">
        {friends.length > 0 ? (
          <GList items={friends} keyExtractor={(friend) => friend.id} pageSize={10} listClassName="gap-1">
            {(friend) => (
              <GButtonAsync
                key={friend.id}
                variant={ButtonVariantEnum.Subtle}
                fullWidth
                className="justify-start text-sm"
                busy={pendingId === friend.id}
                disabled={pendingId !== null}
                startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} />}
                onClick={() => onSelect(friend.id)}>
                {friend.fullName ?? friend.userName}
              </GButtonAsync>
            )}
          </GList>
        ) : (
          <div className="flex flex-col items-center justify-center h-20 text-text-muted text-sm">
            <GIcon icon={Frown} size={SizeEnum.lg} color={AccentColorEnum.Muted} className="mb-1" />
            {noFriendsText}
          </div>
        )}
      </GAsync>
    </GModal>
  );
}

export { InviteModal };
