"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";

import { GAvatar } from "@/component/common/GAvatar";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GAlert } from "@/component/common/GAlert";
import { cn } from "@/lib/cn";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";
import { GamesList } from "@/domain/constant/games";
import { notificationTypeIcon } from "@/domain/constant/notificationIcons";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "@/component/common/GCard";
import { ar } from "@/app/(dashboard)/notifications/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/notifications/i18n/fr.i18n";
import { en } from "@/app/(dashboard)/notifications/i18n/en.i18n";

import type { TNotificationsTranslation } from "@/app/(dashboard)/notifications/i18n/en.i18n";
import type { IUserPreferences } from "@/domain/meta/IUserPreferences";
import type { TNullable } from "@/domain/type/TCommon";

const TOAST_MS = 6000;

const parseShowNotifications = (raw?: string): boolean => {
  try {
    return (JSON.parse(raw ?? "{}") as Partial<IUserPreferences>).showNotifications ?? true;
  } catch {
    return true;
  }
};

function NotificationPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation<TNotificationsTranslation>({ en, ar, fr });
  const { liveNotifications, friends, gameInvites, acceptRequest, declineRequest, acceptGameInvite, dismissGameInvite } = useDashboardData();
  const { user } = useAuth();
  const { state: gameState } = useGame();
  const [visible, setVisible] = useState(false);
  const [actionError, setActionError] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const lastIdRef = useRef<TNullable<string>>(null);
  const timerRef = useRef<TNullable<ReturnType<typeof setTimeout>>>(null);
  const remainingRef = useRef(TOAST_MS);
  const startedRef = useRef(0);

  const showNotifications = useMemo(() => parseShowNotifications(user?.preferences), [user?.preferences]);

  const latest = liveNotifications.length > 0 ? (liveNotifications.find((n) => !dismissedIds.has(n.id)) ?? liveNotifications[0]) : null;

  useEffect(() => {
    if (!latest || pathname === "/notifications" || !showNotifications) {
      return;
    }

    if (latest.id === lastIdRef.current) return;
    lastIdRef.current = latest.id;
    setActionError(false);
    setVisible(true);
  }, [latest, pathname, showNotifications]);

  useEffect(() => {
    if (!visible) return;
    if (actionError) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    remainingRef.current = TOAST_MS;
    startedRef.current = Date.now();
    timerRef.current = setTimeout(() => setVisible(false), TOAST_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = null;
    };
  }, [visible, latest?.id, actionError]);

  const pauseTimer = () => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    timerRef.current = null;
    remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedRef.current));
  };

  const resumeTimer = () => {
    if (timerRef.current || !visible) return;
    startedRef.current = Date.now();
    timerRef.current = setTimeout(() => setVisible(false), remainingRef.current);
  };

  const timeLabel = latest ? new Date(latest.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  if (!latest || !showNotifications) return null;

  if (pathname === "/notifications") return null;

  const dismiss = () => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(latest.id);
      if (next.size > 20) {
        const arr = [...next];
        return new Set(arr.slice(arr.length - 20));
      }
      return next;
    });
    setActionError(false);
    setVisible(false);
  };

  const runAction = async (action: () => Promise<void>) => {
    setActionError(false);
    try {
      await action();
      dismiss();
    } catch {
      setActionError(true);
    }
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismiss();
  };

  const senderFriend =
    latest.type === NotificationTypeEnum.NewMessage && latest.referenceId ? friends.find((f) => f.id === latest.referenceId) : undefined;
  const senderName = senderFriend?.fullName ?? latest.title;
  const TypeIcon = notificationTypeIcon[latest.type] ?? Bell;

  const referenceId = latest.referenceId;
  const isMessage = latest.type === NotificationTypeEnum.NewMessage && Boolean(referenceId);
  const isFriendRequest = latest.type === NotificationTypeEnum.FriendRequest && Boolean(referenceId);
  const isGameInvite = latest.type === NotificationTypeEnum.GameInvite && Boolean(referenceId);
  const isProfileLink = latest.type === NotificationTypeEnum.FriendRequestAccepted && Boolean(referenceId);
  const hasActions = isMessage || isFriendRequest || isGameInvite;

  const inviteGamePath = isGameInvite
    ? GamesList.find((g) => g.type === gameInvites.find((i) => i.roomId === referenceId)?.gameType)?.path
    : undefined;

  const handleBodyClick = () => {
    setVisible(false);
    if (isMessage) router.push(`/messages?friend=${referenceId}`);
    else if (isProfileLink) router.push(`/profile/${referenceId}`);
    else router.push("/notifications");
  };

  const handleAcceptInvite = async () => {
    if (!isGameInvite || !referenceId) return;
    if (gameState !== null) {
      dismiss();
      router.push("/notifications");
      return;
    }
    setActionError(false);
    try {
      await acceptGameInvite(referenceId);
      dismiss();
      if (inviteGamePath) router.push(`/games/${inviteGamePath}`);
    } catch {
      setActionError(true);
    }
  };

  return (
    <div className="pointer-events-none fixed top-[4.25rem] end-4 z-popover w-[calc(100%-2rem)] max-w-sm sm:top-[4.5rem] sm:end-6" role="status" aria-live="polite">
      {!visible ? null : (
        <GCard
          variant={CardVariantEnum.Elevated}
          className="pointer-events-auto group overflow-hidden p-0 shadow-xl"
          onMouseEnter={pauseTimer}
          onMouseLeave={resumeTimer}>
          <div className="flex items-start gap-3 p-4">
            {senderFriend ? (
              <GAvatar user={senderFriend} size={SizeEnum.sm} className="shrink-0" />
            ) : (
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-muted">
                <GIcon icon={TypeIcon} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
              </span>
            )}

            <GButton
              type="button"
              variant={ButtonVariantEnum.Subtle}
              size={SizeEnum.None}
              onClick={handleBodyClick}
              className="min-w-0 flex-1 rounded-none p-0 text-start font-normal justify-start">
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="block truncate text-sm font-semibold text-text">{senderName}</span>
                <span className="block truncate text-xs font-normal text-text-secondary">{latest.body}</span>
              </span>
            </GButton>

            <GButton
              icon={X}
              label={t.actions.dismiss}
              variant={ButtonVariantEnum.Subtle}
              size={SizeEnum.icon}
              onClick={handleDismiss}
              className="rounded-full"
            />
          </div>

          {hasActions && (
            <div className="space-y-2 border-t border-border/60 px-4 py-2">
              {actionError && <GAlert severity={AccentColorEnum.Danger}>{t.actions.error}</GAlert>}
              <div className="flex items-center gap-2">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  {isFriendRequest && (
                    <>
                      <GButton size={SizeEnum.sm} onClick={() => runAction(() => acceptRequest(referenceId ?? ""))}>
                        {t.actions.accept}
                      </GButton>
                      <GButton
                        size={SizeEnum.sm}
                        variant={ButtonVariantEnum.Secondary}
                        onClick={() => runAction(() => declineRequest(referenceId ?? ""))}>
                        {t.actions.decline}
                      </GButton>
                    </>
                  )}
                  {isGameInvite && (
                    <>
                      <GButton size={SizeEnum.sm} onClick={handleAcceptInvite}>
                        {t.actions.accept}
                      </GButton>
                      <GButton
                        size={SizeEnum.sm}
                        variant={ButtonVariantEnum.Secondary}
                        onClick={() => {
                          if (referenceId) dismissGameInvite(referenceId);
                          dismiss();
                        }}>
                        {t.actions.decline}
                      </GButton>
                    </>
                  )}
                  {isMessage && (
                    <GButton
                      size={SizeEnum.sm}
                      onClick={() => {
                        dismiss();
                        router.push(`/messages?friend=${referenceId}`);
                      }}>
                      {t.actions.reply}
                    </GButton>
                  )}
                </div>
                <span className="shrink-0 text-2xs text-text-muted">{timeLabel}</span>
              </div>
            </div>
          )}

          <div
            aria-hidden
            className={cn(
              "h-1 origin-left bg-primary/70 animate-toast-progress",
              actionError ? "[animation-play-state:paused]" : "group-hover:[animation-play-state:paused]",
            )}
          />
        </GCard>
      )}
    </div>
  );
}

export { NotificationPopup };