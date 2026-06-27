"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, RefreshCw, UserCheck, X } from "lucide-react";
import { friendService } from "@/services/def/FriendService";
import { EmptyState } from "@/component/common/TEmpty";
import { SkeletonRow } from "./SkeletonRow";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";

function RequestsTab() {
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await friendService.getReceivedFriendRequests();
      setRequests(response.data ?? []);
    } catch (err) {
      console.error("Failed to load friend requests", err);
      setError("Failed to load requests. Please try again.");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const response = await friendService.getReceivedFriendRequests();
        if (!active) return;
        setRequests(response.data ?? []);
      } catch (err) {
        if (!active) return;
        console.error("Failed to load friend requests", err);
        setError("Failed to load requests. Please try again.");
        setRequests([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const acceptRequest = async (senderId: string) => {
    setActionId(senderId);
    try {
      await friendService.acceptFriendRequest(senderId);
      await loadRequests();
    } catch (err) {
      console.error("Failed to accept friend request", err);
      setError("Failed to accept request. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  const declineRequest = async (senderId: string) => {
    setActionId(senderId);
    try {
      await friendService.rejectFriendRequest(senderId);
      await loadRequests();
    } catch (err) {
      console.error("Failed to decline friend request", err);
      setError("Failed to decline request. Please try again.");
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-5 text-rose-200">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm">{error}</p>
          <button
            onClick={() => void loadRequests()}
            className="inline-flex items-center gap-2 rounded-xl border border-rose-500/30 px-3 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-500/10"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<UserCheck className="h-12 w-12 text-text-muted" />}
        title="No pending requests"
        description="You're all caught up! No friend requests to review."
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
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary/20 to-neon-cyan/20 text-sm font-bold text-white">
                {req.senderFirstName?.charAt(0).toUpperCase() ??
                  req.senderUserName?.charAt(0).toUpperCase() ??
                  "?"}
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-white">
                  {req.senderFirstName && req.senderLastName
                    ? `${req.senderFirstName} ${req.senderLastName}`
                    : req.senderUserName}
                </p>
                <p className="text-xs text-text-muted">Wants to be friends</p>
              </div>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => void acceptRequest(req.senderId)}
                disabled={isBusy}
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500/15 p-3 text-emerald-300 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Accept request"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={() => void declineRequest(req.senderId)}
                disabled={isBusy}
                className="inline-flex items-center justify-center rounded-xl bg-rose-500/15 p-3 text-rose-300 transition hover:bg-rose-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Decline request"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export { RequestsTab };
