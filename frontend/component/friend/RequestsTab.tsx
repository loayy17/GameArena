"use client";

import { useState } from "react";
import { Check, UserCheck, X } from "lucide-react";
import { GEmpty } from "@/component/common/GEmpty";
import { GButton } from "../common/GButton";
import { GSkeleton } from "../common/GSkeleton";
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
          <div
            key={i}
            className="bg-bg-card border border-border rounded-xl p-4 animate-pulse flex items-center justify-between"
          >
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
          </div>
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <GEmpty
        icon={<UserCheck className="h-12 w-12 text-text-muted" />}
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
          <div
            key={req.senderId}
            className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-bg-card/70 px-4 py-4 transition hover:border-primary/50"
          >
            <div className="min-w-0 flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-neon-cyan/20 text-sm font-bold text-text">
                {req.senderFirstName?.charAt(0).toUpperCase() ??
                  req.senderUserName?.charAt(0).toUpperCase() ??
                  "?"}
              </div>
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
                variant="ghost"
                size="icon"
                onClick={() => {
                  setActionId(req.senderId);
                  accept(req.senderId).finally(() => setActionId(null));
                }}
                disabled={isBusy}
                className="bg-neon-green/15 text-neon-green hover:bg-neon-green/25"
                aria-label={t.requestsTab.accept}
              >
                <Check className="h-4 w-4" />
              </GButton>
              <GButton
                variant="ghost"
                size="icon"
                onClick={() => {
                  setActionId(req.senderId);
                  decline(req.senderId).finally(() => setActionId(null));
                }}
                disabled={isBusy}
                className="bg-error/15 text-error hover:bg-error/25"
                aria-label={t.requestsTab.decline}
              >
                <X className="h-4 w-4" />
              </GButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { RequestsTab };
