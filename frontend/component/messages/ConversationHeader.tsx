"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2 } from "lucide-react";

import { GAvatar } from "@/component/common/GAvatar";
import { GButton } from "@/component/common/GButton";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { focusRing } from "@/domain/constant/style-tokens";
import { cn } from "@/lib/cn";

import { GameInviteModal } from "./GameInviteModal";

import type { IConversationHeaderProps } from "./def/ConversationHeader";

function ConversationHeader({
  friend,
  friendId,
  statusClass,
  statusLabel,
  isConnected,
  disconnectedLabel,
  backLabel,
  onBack,
  inviteLabel,
}: IConversationHeaderProps) {
  const [inviteOpen, setInviteOpen] = useState(false);
  const displayName = friend?.fullName ?? friendId;

  const identity = (
    <>
      <GAvatar user={friend ?? { firstName: "", lastName: "" }} size={SizeEnum.sm} />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-base font-bold text-text group-hover:underline">{displayName}</h2>
        <p className={cn("text-xs font-medium", statusClass)}>{statusLabel}</p>
      </div>
    </>
  );

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-border bg-surface px-4 py-4 sm:px-6">
      <div className="sm:hidden">
        <GButton icon={ArrowLeft} label={backLabel} flip onClick={onBack} />
      </div>
      {friendId ? (
        <Link href={`/profile/${friendId}`} className={cn("group flex min-w-0 flex-1 items-center gap-3 rounded-lg", focusRing)}>
          {identity}
        </Link>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3">{identity}</div>
      )}
      {friendId && inviteLabel && <GButton icon={Gamepad2} label={inviteLabel} onClick={() => setInviteOpen(true)} />}
      {!isConnected && disconnectedLabel && <span className="text-xs text-danger">{disconnectedLabel}</span>}
      {friendId && inviteOpen && (
        <GameInviteModal open friendId={friendId} friendName={displayName} onClose={() => setInviteOpen(false)} />
      )}
    </header>
  );
}

export { ConversationHeader };
