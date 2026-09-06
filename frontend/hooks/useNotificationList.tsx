"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bell, Gamepad2, Users } from "lucide-react";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useGameTranslation } from "@/hooks/useGameTranslation";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";
import { notificationTypeIcon } from "@/domain/constant/notificationIcons";
import { ar } from "@/app/(dashboard)/notifications/i18n/ar.i18n";
import { fr } from "@/app/(dashboard)/notifications/i18n/fr.i18n";
import { en } from "@/app/(dashboard)/notifications/i18n/en.i18n";

import type { TNotificationsTranslation } from "@/app/(dashboard)/notifications/i18n/en.i18n";
import type { IGTabItem } from "@/component/common/def/GTabs";
import type { INotificationListItem, TNotificationTab } from "@/app/(dashboard)/notifications/def/NotificationsPage";

const tabFilterType: Record<TNotificationTab, NotificationTypeEnum | null> = {
  all: null,
  gameInvites: NotificationTypeEnum.GameInvite,
  friendRequests: NotificationTypeEnum.FriendRequest,
};

export { notificationTypeIcon };

function timeAgo(date: Date, t: TNotificationsTranslation) {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return t.time.justNow;
  if (minutes < 60) return t.time.minutesAgo.replace("{n}", String(minutes));
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t.time.hoursAgo.replace("{n}", String(hours));
  return t.time.daysAgo.replace("{n}", String(Math.floor(hours / 24)));
}

export function useNotificationList(tab: TNotificationTab) {
  const router = useRouter();
  const t = useTranslation<TNotificationsTranslation>({ en, ar, fr });
  const gameT = useGameTranslation();
  const {
    notifications,
    gameInvites,
    requests,
    dismissGameInvite,
    acceptGameInvite,
    acceptRequest,
    declineRequest,
    deleteNotification,
    markNotificationRead,
  } = useDashboardData();

  const items = useMemo(() => {
    const out: INotificationListItem[] = [];
    const seenMessageSenders = new Set<string>();
    const source = notifications.filter((n) => {
      if (n.type !== NotificationTypeEnum.NewMessage || !n.referenceId) return true;
      if (seenMessageSenders.has(n.referenceId)) return false;
      seenMessageSenders.add(n.referenceId);
      return true;
    });

    for (const n of source) {
      const isGameInvite = n.type === NotificationTypeEnum.GameInvite && n.referenceId != null;
      if (isGameInvite && gameInvites.some((g) => g.roomId === n.referenceId)) continue;

      const item: INotificationListItem = {
        id: n.id,
        type: n.type,
        title: n.title,
        desc: n.body,
        time: timeAgo(new Date(n.createdAt), t),
        read: n.isRead,
      };

      switch (n.type) {
        case NotificationTypeEnum.GameInvite:
          if (isGameInvite) {
            item.onAction = async () => {
              try {
                await acceptGameInvite(n.referenceId as string);
              } catch {
                dismissGameInvite(n.referenceId as string);
              }
            };
            item.onDismiss = async () => {
              dismissGameInvite(n.referenceId as string);
            };
          }
          break;
        case NotificationTypeEnum.FriendRequest:
          if (!n.isRead) {
            item.onAction = async () => {
              await acceptRequest(n.referenceId ?? "");
            };
            item.onDismiss = async () => {
              await declineRequest(n.referenceId ?? "");
            };
          }
          break;
        case NotificationTypeEnum.NewMessage:
          item.onClick = () => {
            router.push(`/messages?friend=${n.referenceId}`);
          };
          if (!n.isRead) {
            item.onAction = async () => {
              router.push(`/messages?friend=${n.referenceId}`);
            };
          }
          break;
        case NotificationTypeEnum.FriendRequestAccepted:
          item.onClick = () => {
            router.push(`/profile/${n.referenceId}`);
            markNotificationRead(n.id);
          };
          break;
      }

      if (!item.onAction && !item.onDismiss && n.isRead) {
        item.onDismiss = async () => {
          deleteNotification(n.id);
        };
      }

      out.push(item);
    }

    for (const g of gameInvites) {
      out.push({
        id: `g-${g.roomId}`,
        type: NotificationTypeEnum.GameInvite,
        title: gameT.invite.receivedTitle,
        desc: gameT.invite.receivedDescription.replace("{name}", g.inviterName ?? gameT.invite.fallbackName).replace("{game}", gameT.invite.fallbackName),
        time: timeAgo(new Date(), t),
        read: false,
        onAction: async () => {
          try {
            await acceptGameInvite(g.roomId);
          } catch {
            dismissGameInvite(g.roomId);
          }
        },
        onDismiss: async () => {
          dismissGameInvite(g.roomId);
        },
      });
    }

    for (const r of requests) {
      const name = r.senderFullName || `${r.senderFirstName ?? ""} ${r.senderLastName ?? ""}`.trim() || (r.senderUserName ?? gameT.invite.fallbackName);
      out.push({
        id: `fr-${r.senderId}`,
        type: NotificationTypeEnum.FriendRequest,
        title: t.friendRequest.title,
        desc: t.friendRequest.description.replace("{name}", name),
        time: timeAgo(new Date(r.sentAt), t),
        read: false,
        onAction: async () => {
          await acceptRequest(r.senderId);
        },
        onDismiss: async () => {
          await declineRequest(r.senderId);
        },
      });
    }

    out.sort((a, b) => +a.read - +b.read);

    const filterType = tabFilterType[tab];
    if (!filterType) return out;
    return out.filter((n) => n.type === filterType || (tab === "friendRequests" && n.type === NotificationTypeEnum.FriendRequestAccepted));
  }, [tab, notifications, gameInvites, requests, t, gameT, acceptGameInvite, dismissGameInvite, acceptRequest, declineRequest, router, deleteNotification, markNotificationRead]);

  const unreadCount = useMemo(() => items.filter((i) => !i.read).length, [items]);

  const tabs = useMemo<IGTabItem<TNotificationTab>[]>(
    () => [
      { id: "all", label: t.tabs.all, icon: <GIcon icon={Bell} size={SizeEnum.sm} />, badge: unreadCount || undefined, badgeTone: AccentColorEnum.Primary },
      {
        id: "gameInvites",
        label: t.tabs.gameInvites,
        icon: <GIcon icon={Gamepad2} size={SizeEnum.sm} />,
        badge: gameInvites.length || undefined,
        badgeTone: AccentColorEnum.Accent,
      },
      {
        id: "friendRequests",
        label: t.tabs.friendRequests,
        icon: <GIcon icon={Users} size={SizeEnum.sm} />,
        badge: requests.length || undefined,
        badgeTone: AccentColorEnum.Warning,
      },
    ],
    [t, unreadCount, gameInvites.length, requests.length],
  );

  return { t, tabs, items, unreadCount };
}
