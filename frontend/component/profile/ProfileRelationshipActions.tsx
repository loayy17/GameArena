"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageSquare, Pencil, ShieldOff, UserMinus, UserPlus, X } from "lucide-react";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { GAsync } from "@/component/common/GAsync";
import { GAlert } from "@/component/common/GAlert";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

import type { TNullable } from "@/domain/type/TCommon";
import type { IProfileRelationshipActionsProps, ProfileRelationship } from "./def/ProfileRelationshipActions";

function ProfileRelationshipActions({ profileId, userId, t }: IProfileRelationshipActionsProps) {
  const errorMessage = useErrorMessage();
  const {
    friends,
    requests,
    sentRequests,
    blockedUsers,
    loading: dataLoading,
    sendRequest,
    acceptRequest,
    declineRequest,
    cancelRequest,
    unblockUser,
  } = useDashboardData();
  const [actionError, setActionError] = useState<TNullable<string>>(null);
  const router = useRouter();

  const relation = useMemo<ProfileRelationship | null>(() => {
    if (!userId) return "none";
    if (profileId === userId) return "self";
    if (blockedUsers.some((b) => b.id === profileId)) return "blocked";
    if (requests.some((r) => r.senderId === profileId)) return "received";
    if (sentRequests.some((r) => r.receiverId === profileId)) return "sent";
    if (friends.some((f) => f.id === profileId)) return "friend";
    return "none";
  }, [profileId, userId, friends, requests, sentRequests, blockedUsers]);

  const runAction = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
    } catch (e: unknown) {
      setActionError(errorMessage(toErrorCode(e)));
    }
  };

  if (dataLoading && relation !== "self") {
    return (
      <GAsync loading>
        <span />
      </GAsync>
    );
  }

  if (relation === null) {
    return null;
  }

  return (
    <div className="flex w-full flex-col items-stretch gap-2">
      {relation === "self" && (
        <GButton
          variant={ButtonVariantEnum.Secondary}
          className="rounded-md"
          startIcon={<GIcon icon={Pencil} size={SizeEnum.sm} />}
          onClick={() => router.push("/settings")}>
          {t.actions.editProfile}
        </GButton>
      )}
      {relation === "none" && (
        <GButton
          variant={ButtonVariantEnum.Primary}
          className="rounded-md"
          startIcon={<GIcon icon={UserPlus} size={SizeEnum.sm} />}
          onClick={() => runAction(() => sendRequest(profileId))}>
          {t.actions.addFriend}
        </GButton>
      )}
      {relation === "sent" && (
        <GButton
          variant={ButtonVariantEnum.Secondary}
          className="rounded-md"
          startIcon={<GIcon icon={UserMinus} size={SizeEnum.sm} />}
          onClick={() => runAction(() => cancelRequest(profileId))}>
          {t.actions.unsend}
        </GButton>
      )}
      {relation === "received" && (
        <div className="grid grid-cols-2 gap-2">
          <GButton
            variant={ButtonVariantEnum.Primary}
            className="rounded-md"
            startIcon={<GIcon icon={Check} size={SizeEnum.sm} />}
            onClick={() => runAction(() => acceptRequest(profileId))}>
            {t.actions.accept}
          </GButton>
          <GButton
            variant={ButtonVariantEnum.Secondary}
            className="rounded-md"
            startIcon={<GIcon icon={X} size={SizeEnum.sm} />}
            onClick={() => runAction(() => declineRequest(profileId))}>
            {t.actions.decline}
          </GButton>
        </div>
      )}
      {relation === "friend" && (
        <GButton
          variant={ButtonVariantEnum.Secondary}
          startIcon={<GIcon icon={MessageSquare} size={SizeEnum.sm} />}
          onClick={() => router.push(`/messages?friend=${profileId}`)}>
          {t.actions.message}
        </GButton>
      )}
      {relation === "blocked" && (
        <GButton
          variant={ButtonVariantEnum.Secondary}
          startIcon={<GIcon icon={ShieldOff} size={SizeEnum.sm} />}
          onClick={() => runAction(() => unblockUser(profileId))}>
          {t.actions.unblock}
        </GButton>
      )}
      {actionError && <GAlert severity={AccentColorEnum.Danger}>{actionError}</GAlert>}
    </div>
  );
}

export { ProfileRelationshipActions };
