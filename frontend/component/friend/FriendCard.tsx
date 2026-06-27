/* eslint-disable @next/next/no-img-element */
"use client";
import { Gamepad2, MessageSquare } from "lucide-react";
import type { IFriendCardProps } from "./def/IFriendCard";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";

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
    <h3 className="text-white font-semibold mt-2">
      {user.fullName ??
        [user.firstName, user.lastName].filter(Boolean).join(" ")}
    </h3>
    <p className="text-text-secondary text-sm">@{user.userName}</p>
    <div className="flex gap-2 mt-4 w-full">
      <button
        onClick={onMessage}
        className="flex-1 py-2 bg-primary text-white rounded-lg text-sm flex items-center justify-center gap-1 hover:bg-primary-hover transition"
      >
        <MessageSquare size={16} /> Message
      </button>
      <button
        onClick={onInvite}
        className="flex-1 py-2 bg-surface border hover:bg-surface-hover border-border text-text rounded-lg text-sm flex items-center justify-center gap-1 transition"
      >
        <Gamepad2 size={16} /> Invite
      </button>
    </div>
  </div>
);

export { FriendCard };
