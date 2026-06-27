"use client";

import {
  ChevronLeft,
  ChevronRight,
  Gamepad2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "@/Hooks/useTranslation";
import { ar } from "./i18n/SocialMedia/ar.i18n";
import { en, type TSocialTranslation } from "./i18n/SocialMedia/en.i18n";
import { friendService } from "@/services/def/FriendService";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { TTile } from "./common/TTile";
import { TBadge } from "./common/TBadge";
import { TButton } from "./common/TButton";
import { useDashboardNotifications } from "@/app/(dashboard)/DashboardNotificationsProvider";
import type { IUser } from "@/domain/meta/IUser";

const statusColor: Record<string, string> = {
  "Playing Match": "text-neon-cyan",
  "In Lobby": "text-neon-magenta",
  "In Match": "text-primary",
  Online: "text-neon-green",
};

function SocialPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSocialTranslation;
  const [friends, setFriends] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { gameInvites, acceptGameInvite, dismissGameInvite } =
    useDashboardNotifications();

  useEffect(() => {
    let alive = true;

    void (async () => {
      setLoading(true);
      try {
        const response = await friendService.getFriends({
          name: null,
          userStatus: UserStatusEnum.All,
        });

        if (!alive) return;
        setFriends(response.data || []);
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const handleAcceptInvite = async (roomId: string) => {
    await acceptGameInvite(roomId);
    router.push("/tic-tac-toe");
  };

  return (
    <aside
      className={`hidden shrink-0 overflow-y-auto border-l border-border bg-bg-sidebar lg:flex lg:flex-col ${collapsed ? "w-16" : "w-80"}`}
    >
      <div
        className={`flex h-16 items-center border-b border-border px-4 ${collapsed ? "justify-center" : "justify-end"}`}
      >
        <TButton
          variant="secondary"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-surface-alt hover:text-text"
        >
          {collapsed ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </TButton>
      </div>

      {!collapsed && (
        <div className="px-4 pt-4">
          <div className="mb-4 rounded-2xl border border-border bg-bg-card/60 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase text-text-secondary">
                {t.title}
              </h2>
              {gameInvites.length > 0 && <TBadge count={gameInvites.length} />}
            </div>

            <p className="text-[11px] text-text-muted">
              {friends.filter((f) => f.status === UserStatusEnum.InGame).length}{" "}
              {t.inMatch}
            </p>
          </div>

          {gameInvites.length > 0 && (
            <div className="mb-4 space-y-3">
              {gameInvites.map((invite) => (
                <div
                  key={invite.roomId}
                  className="rounded-2xl border border-primary/20 bg-primary/10 p-4"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
                      <Gamepad2 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text">
                        {invite.inviterName || "A friend"}
                      </p>
                      <p className="text-xs text-text-muted">
                        sent you a game invite
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <TButton
                      size="sm"
                      className="flex-1"
                      onClick={() => void handleAcceptInvite(invite.roomId)}
                    >
                      Join
                    </TButton>
                    <TButton
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      onClick={() => dismissGameInvite(invite.roomId)}
                    >
                      Dismiss
                    </TButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="w-full space-y-1 px-3 py-2">
        {loading && friends.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : friends.length === 0 ? (
          <p className="px-3 py-4 text-sm text-text-muted">
            No friends online yet.
          </p>
        ) : (
          friends.map((friend) => (
            <TButton
              key={friend.id}
              onClick={() => router.push(`/messages?friend=${friend.id}`)}
              className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-surface-alt ${collapsed ? "justify-center" : ""}`}
            >
              <TTile user={friend} size="sm" />

              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">
                    {friend.fullName ??
                      [friend.firstName, friend.lastName]
                        .filter(Boolean)
                        .join(" ")}
                  </p>
                  <p
                    className={`truncate text-xs ${statusColor[friend.status] || "text-text-secondary"}`}
                  >
                    {friend.status === UserStatusEnum.InGame && (
                      <Gamepad2 className="mr-1 inline h-3 w-3" />
                    )}
                    {t.userStatus[friend.status as keyof typeof t.userStatus]}
                  </p>
                </div>
              )}
            </TButton>
          ))
        )}
      </div>
    </aside>
  );
}

export { SocialPanel };
