"use client";

import { useState } from "react";
import { Check, UserCheck, X } from "lucide-react";
import { GEmpty } from "@/component/common/GEmpty";
import { GButton } from "../common/GButton";
import { GSkeleton } from "../common/GSkeleton";
import { GCard } from "../common/GCard";
import { GAvatar } from "../common/GAvatar";
import { GIcon } from "../common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { useFriendRequests } from "@/hooks/useFriends";
import {
  en,
  type TFriendsTranslation,
} from "@/app/(dashboard)/friends/i18n/en.i18n";
import { ar } from "@/app/(dashboard)/friends/i18n/ar.i18n";

function RequestsTab() {
  const t = useTranslation({ en, ar }) as TFriendsTranslation;
  const { requests, loading, accept, decline } = useFriendRequests();
  const [actionId, setActionId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <GCard key={i} padding="sm" className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GSkeleton variant="rect" className="w-10 h-10" />
              <div>
                <GSkeleton variant="text" className="w-32" />
                <GSkeleton variant="text" className="w-20 mt-1" />
              </div>
            </div>
            <div className="flex gap-2">
              <GSkeleton variant="circle" className="w-8 h-8" />
              <GSkeleton variant="circle" className="w-8 h-8" />
            </div>
          </GCard>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <GEmpty
        icon={<GIcon icon={UserCheck} size="xl" color="muted" />}
        title={t.requestsTab.emptyTitle}
        description={t.requestsTab.emptyDescription}
      />
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const isBusy = actionId === req.senderId;

        return (
          <GCard
            key={req.senderId}
            variant="interactive"
            padding="sm"
            className="flex items-center justify-between gap-4"
          >
            <div className="min-w-0 flex items-center gap-3">
              <GAvatar
                firstName={req.senderFirstName}
                lastName={req.senderLastName}
                userName={req.senderUserName}
                size="sm"
              />
              <div className="min-w-0">
                <p className="truncate font-medium text-text">
                  {req.senderFirstName && req.senderLastName
                    ? `${req.senderFirstName} ${req.senderLastName}`
                    : req.senderUserName}
                </p>
                <p className="text-xs text-text-muted">
                  {t.requestsTab.wantsToBeFriends}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <GButton
                size="sm"
                variant="success"
                disabled={isBusy}
                aria-label={t.requestsTab.accept}
                onClick={async () => {
                  setActionId(req.senderId);
                  try {
                    await accept(req.senderId);
                  } finally {
                    setActionId(null);
                  }
                }}
                leftIcon={<GIcon icon={Check} size="sm" color="inherit" className="text-bg" />}
              />
              <GButton
                size="sm"
                variant="danger"
                disabled={isBusy}
                aria-label={t.requestsTab.decline}
                onClick={async () => {
                  setActionId(req.senderId);
                  try {
                    await decline(req.senderId);
                  } finally {
                    setActionId(null);
                  }
                }}
                leftIcon={<GIcon icon={X} size="sm" color="inherit" className="text-on-primary" />}
              />
            </div>
          </GCard>
        );
      })}
    </div>
  );
}

export { RequestsTab };
