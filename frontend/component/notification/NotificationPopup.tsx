"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, X } from "lucide-react";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useAuth } from "@/app/providers/AuthProvider";
import { useGame } from "@/app/providers/GameProvider";
import { GButton } from "@/component/common/GButton";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GIcon } from "@/component/common/GIcon";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";
import { GamesList } from "@/domain/constant/games";
import type { TNullable } from "@/domain/type/TCommon";
import { useTranslation } from "@/hooks/useSetting";
import { GCard } from "@/component/common/GCard";

import { ar } from "@/app/(dashboard)/notifications/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/notifications/i18n/fr.i18n";
import { en, type TNotificationsTranslation } from "@/app/(dashboard)/notifications/i18n/en.i18n";

function NotificationPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation({ en, ar, fr }) as TNotificationsTranslation;
  const { liveNotifications, requests, gameInvites, acceptRequest, declineRequest, acceptGameInvite, dismissGameInvite } = useDashboardData();
  const { user } = useAuth();
  const { state: gameState } = useGame();
  const [visible, setVisible] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const timerRef = useRef<TNullable<ReturnType<typeof setTimeout>>>(null);
  const lastIdRef = useRef<TNullable<string>>(null);

  const showNotifications = (() => {
    if (!user?.preferences) return true;
    try {
      const p = JSON.parse(user.preferences) as { showNotifications?: boolean };
      return p.showNotifications ?? true;
    } catch {
      return true;
    }
  })();

  const latest = liveNotifications.length > 0 ? (liveNotifications.find((n) => !dismissedIds.has(n.id)) ?? liveNotifications[0]) : null;

  useEffect(() => {
    if (!latest || pathname === "/notifications" || !showNotifications) {
      return;
    }

    if (latest.id === lastIdRef.current) return;
    lastIdRef.current = latest.id;

    setVisible(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setVisible(false);
    }, 6000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [latest, pathname, showNotifications]);

  if (!visible || !latest || pathname === "/notifications" || !showNotifications) return null;

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
    setVisible(false);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    dismiss();
  };

  const pendingRequest =
    latest.type === NotificationTypeEnum.FriendRequest && latest.referenceId ? requests.find((r) => r.senderId === latest.referenceId) : undefined;
  const pendingInvite =
    latest.type === NotificationTypeEnum.GameInvite && latest.referenceId ? gameInvites.find((g) => g.roomId === latest.referenceId) : undefined;
  const isMessage = latest.type === NotificationTypeEnum.NewMessage && Boolean(latest.referenceId);

  const handleBodyClick = () => {
    setVisible(false);
    if (isMessage) router.push(`/messages?friend=${latest.referenceId}`);
    else router.push("/notifications");
  };

  const handleAcceptInvite = async () => {
    if (!pendingInvite) return;
    if (gameState !== null) {
      dismiss();
      router.push("/notifications");
      return;
    }
    const path = GamesList.find((g) => g.type === pendingInvite.gameType)?.path;
    await acceptGameInvite(pendingInvite.roomId);
    dismiss();
    if (path) router.push(`/games/${path}`);
  };

  return (
    <div className="fixed top-4 left-1/2 z-popover w-[calc(100%-2rem)] max-w-md -translate-x-1/2" role="status" aria-live="polite">
      <GCard variant={CardVariantEnum.Elevated} padding={SizeEnum.md} className="shadow-xl shadow-black/10">
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleBodyClick} className="flex min-w-0 flex-1 items-center gap-3 text-start">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-muted">
              <GIcon icon={Bell} size={SizeEnum.sm} color={AccentColorEnum.Primary} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-text">{latest.title}</span>
              <span className="block truncate text-xs text-text-secondary">{latest.body}</span>
            </span>
          </button>
          <GButton
            variant={ButtonVariantEnum.Subtle}
            size={SizeEnum.icon}
            rounded={SizeEnum.full}
            onClick={handleDismiss}
            aria-label={t.actions.dismiss}>
            <GIcon icon={X} size={SizeEnum.sm} color={AccentColorEnum.Muted} />
          </GButton>
        </div>

        {(pendingRequest || pendingInvite || isMessage) && (
          <div className="mt-3 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
            {pendingRequest && (
              <>
                <GButtonAsync
                  size={SizeEnum.sm}
                  onClick={async () => {
                    await acceptRequest(pendingRequest.senderId);
                    dismiss();
                  }}>
                  {t.actions.accept}
                </GButtonAsync>
                <GButtonAsync
                  size={SizeEnum.sm}
                  variant={ButtonVariantEnum.Secondary}
                  onClick={async () => {
                    await declineRequest(pendingRequest.senderId);
                    dismiss();
                  }}>
                  {t.actions.decline}
                </GButtonAsync>
              </>
            )}
            {pendingInvite && (
              <>
                <GButtonAsync size={SizeEnum.sm} onClick={handleAcceptInvite}>
                  {t.actions.accept}
                </GButtonAsync>
                <GButtonAsync
                  size={SizeEnum.sm}
                  variant={ButtonVariantEnum.Secondary}
                  onClick={async () => {
                    dismissGameInvite(pendingInvite.roomId);
                    dismiss();
                  }}>
                  {t.actions.decline}
                </GButtonAsync>
              </>
            )}
            {isMessage && (
              <GButtonAsync
                size={SizeEnum.sm}
                onClick={async () => {
                  dismiss();
                  router.push(`/messages?friend=${latest.referenceId}`);
                }}>
                {t.actions.reply}
              </GButtonAsync>
            )}
          </div>
        )}
      </GCard>
    </div>
  );
}

export { NotificationPopup };
