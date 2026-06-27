/* eslint-disable @next/next/no-img-element */
"use client";
import { Gamepad2, MessageSquare } from "lucide-react";
import type { IFriendCardProps } from "./def/IFriendCard";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { TButton } from "../common/TButton";

const getStatusColor = (status?: UserStatusEnum) => {
  switch (status) {
    case UserStatusEnum.Online:
      return "bg-green-500";
    case UserStatusEnum.Offline:
      return "bg-gray-500";
    case UserStatusEnum.InGame:
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const FriendCard = ({ user, onMessage, onInvite }: IFriendCardProps) => (
  <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col items-center hover:border-primary/50 transition-shadow hover:shadow-lg">
    <div className="relative">
      <img
        src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=7c5cfc&color=fff`}
        className="w-16 h-16 rounded-xl object-cover"
        alt=""
      />
      <span
        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-bg-card ${getStatusColor(user.status)}`}
      />
    </div>
    <h3 className="text-text font-semibold mt-2">
      {user.fullName ??
        [user.firstName, user.lastName].filter(Boolean).join(" ")}
    </h3>
    <p className="text-text-secondary text-sm">@{user.userName}</p>
    <div className="flex gap-2 mt-4 w-full">
      <TButton
        onClick={onMessage}
        size="sm"
        className="flex-1"
        leftIcon={<MessageSquare size={16} />}
      >
        Message
      </TButton>
      <TButton
        onClick={onInvite}
        variant="secondary"
        size="sm"
        className="flex-1"
        leftIcon={<Gamepad2 size={16} />}
      >
        Invite
      </TButton>
    </div>
  </div>
);

export { FriendCard };
