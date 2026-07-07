"use client";
import { Gamepad2, MessageSquare } from "lucide-react";
import type { IFriendCardProps } from "./def/IFriendCard";
import { GButton } from "../common/GButton";
import { GAvatar } from "../common/GAvatar";
import { GStatusDot } from "../common/GStatusDot";
import { GCard } from "../common/GCard";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TFriendsTranslation } from "@/app/(dashboard)/friends/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";

const FriendCard = ({ user, onMessage, onInvite }: IFriendCardProps) => {
  const t = useTranslation({ en, ar }) as TFriendsTranslation;

  return (
    <GCard variant="interactive" padding="md" className="flex flex-col items-center">
      <div className="relative">
        <GAvatar
          firstName={user.firstName}
          lastName={user.lastName}
          userName={user.userName}
          src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=7c5cfc&color=fff`}
          size="md"
        />
        <GStatusDot status={user.status} />
      </div>
      <h3 className="text-text font-semibold mt-2">
        {user.fullName ??
          [user.firstName, user.lastName].filter(Boolean).join(" ")}
      </h3>
      <p className="text-text-secondary text-sm">@{user.userName}</p>
      <div className="flex gap-2 mt-4 w-full">
        <GButton
          onClick={onMessage}
          size="sm"
          className="flex-1"
          leftIcon={<MessageSquare size={16} />}
        >
          {t.message}
        </GButton>
        <GButton
          onClick={onInvite}
          variant="secondary"
          size="sm"
          className="flex-1"
          leftIcon={<Gamepad2 size={16} />}
        >
          {t.invite}
        </GButton>
      </div>
    </GCard>
  );
};

export { FriendCard };
