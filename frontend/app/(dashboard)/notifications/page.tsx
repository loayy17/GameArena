"use client";

import { useMemo, useState } from "react";
import { Bell, Gamepad2, Users, MessageSquare, X, Check, Trash2, CheckCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { notificationService } from "@/services/def/NotificationService";
import { GTabs } from "@/component/common/GTabs";
import { GCard } from "@/component/common/GCard";
import { GPage } from "@/component/common/GPage";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { PageHeader } from "@/component/common/PageHeader";
import { GButton } from "@/component/common/GButton";
import { GEmpty } from "@/component/common/GEmpty";
import { GAsync } from "@/component/common/GAsync";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type TNotificationsTranslation } from "./i18n/en.i18n";
import type { IGTabItem } from "@/component/common/def/GTabs";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";

type Tab = "all" | "gameInvites" | "friendRequests";

function timeAgo(d: Date, t: TNotificationsTranslation) {
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if (m < 1) return t.time.justNow;
  if (m < 60) return t.time.minutesAgo.replace("{n}", String(m));
  const h = Math.floor(m / 60);
  if (h < 24) return t.time.hoursAgo.replace("{n}", String(h));
  return t.time.daysAgo.replace("{n}", String(Math.floor(h / 24)));
}

const icons: Record<NotificationTypeEnum, typeof Users> = {
  [NotificationTypeEnum.FriendRequest]: Users,
  [NotificationTypeEnum.FriendRequestAccepted]: Users,
  [NotificationTypeEnum.GameInvite]: Gamepad2,
  [NotificationTypeEnum.NewMessage]: MessageSquare,
};

export default function NotificationsPage() {
  const t = useTranslation({ en, ar, fr }) as TNotificationsTranslation;
  const {
    notifications,
    gameInvites,
    dismissGameInvite,
    acceptGameInvite,
    requests,
    loading: requestsLoading,
    acceptRequest,
    declineRequest,
  } = useDashboardData();
  const [tab, setTab] = useState<Tab>("all");

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const tabs = useMemo<IGTabItem<Tab>[]>(
    () => [
      { id: "all", label: t.tabs.all, icon: <GIcon icon={Bell} size={SizeEnum.sm} />, badge: unreadCount || undefined },
      {
        id: "gameInvites",
        label: t.tabs.gameInvites,
        icon: <GIcon icon={Gamepad2} size={SizeEnum.sm} />,
        badge: gameInvites.length || undefined,
      },
      {
        id: "friendRequests",
        label: t.tabs.friendRequests,
        icon: <GIcon icon={Users} size={SizeEnum.sm} />,
        badge: requests.length || undefined,
      },
    ],
    [t, unreadCount, gameInvites.length, requests.length],
  );

  const all = useMemo(() => {
    const out: Array<{
      id: string;
      type: NotificationTypeEnum;
      title: string;
      desc: string;
      time: string;
      read: boolean;
      onAction?(): void;
      onDismiss?(): void;
    }> = [];
    for (const n of notifications) {
      const isGameInvite = n.type === "GameInvite" && n.referenceId != null;
      if (isGameInvite && gameInvites.some((g) => g.roomId === n.referenceId)) continue;
      out.push({
        id: n.id,
        type: n.type,
        title: n.title,
        desc: n.body,
        time: timeAgo(new Date(n.createdAt), t),
        read: n.isRead,
        onAction: isGameInvite
          ? () => {
              acceptGameInvite(n.referenceId as string)
                .then(() => notificationService.markNotificationRead(n.id))
                .catch(() => {});
            }
          : n.isRead
            ? undefined
            : () => notificationService.markNotificationRead(n.id),
        onDismiss: isGameInvite
          ? () => {
              dismissGameInvite(n.referenceId as string);
              notificationService.deleteNotification(n.id);
            }
          : undefined,
      });
    }
    for (const g of gameInvites) {
      out.push({
        id: `g-${g.roomId}`,
        type: NotificationTypeEnum.GameInvite,
        title: t.gameInvite.title,
        desc: t.gameInvite.description.replace("{name}", g.inviterName ?? t.gameInvite.fallbackName).replace("{game}", t.gameInvite.fallbackName),
        time: timeAgo(new Date(), t),
        read: false,
        onAction: () => acceptGameInvite(g.roomId),
        onDismiss: () => dismissGameInvite(g.roomId),
      });
    }
    for (const r of requests) {
      const name = `${r.senderFirstName ?? ""} ${r.senderLastName ?? ""}`.trim() || (r.senderUserName ?? t.gameInvite.fallbackName);
      out.push({
        id: `fr-${r.senderId}`,
        type: NotificationTypeEnum.FriendRequest,
        title: t.friendRequest.title,
        desc: t.friendRequest.description.replace("{name}", name),
        time: timeAgo(new Date(r.sentAt), t),
        read: false,
        onAction: () => acceptRequest(r.senderId),
        onDismiss: () => declineRequest(r.senderId),
      });
    }
    out.sort((a, b) => +a.read - +b.read);
    return out;
  }, [notifications, gameInvites, requests, t, acceptGameInvite, dismissGameInvite, acceptRequest, declineRequest]);

  const filtered = useMemo(() => {
    if (tab === "all") return all;
    const m: Record<Tab, string> = { all: "", gameInvites: "GameInvite", friendRequests: "FriendRequest" };
    return all.filter((n) => n.type === m[tab] || (tab === "friendRequests" && n.type === "FriendRequestAccepted"));
  }, [all, tab]);

  return (
    <GPage size={SizeEnum.lg}>
      <PageHeader icon={Bell} title={t.title} subtitle={t.subtitle} />
      {tab === "all" && unreadCount > 0 && (
        <div className="flex justify-end flex-wrap -mt-3 mb-3">
          <GButton size={SizeEnum.md} variant={ButtonVariantEnum.Subtle} onClick={() => notificationService.markAllNotificationsRead()}>
            <CheckCheck size={16} />
            <span className="ms-1">{t.markAllRead}</span>
          </GButton>
        </div>
      )}
      <GTabs tabs={tabs} value={tab} onChange={setTab} fullWidth className="mb-2" />
      <GAsync loading={tab === "friendRequests" && requestsLoading} spinnerSize={SizeEnum.md} errorTitle={t.error.title} className="py-16">
        {filtered.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={Bell} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
            title={t.empty.title}
            description={t.empty.description}
          />
        ) : (
          <GList
            items={filtered}
            keyExtractor={(n) => n.id}
            pageSize={10}
            listClassName="gap-3"
            emptyMessage={t.empty.title}
            emptyDescription={t.empty.description}
            emptyIcon={<GIcon icon={Bell} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}>
            {(n) => (
              <GCard
                variant={n.read ? CardVariantEnum.Default : CardVariantEnum.Interactive}
                padding={SizeEnum.md}
                className={n.read ? "opacity-60" : ""}>
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.read ? "bg-surface" : "bg-primary-muted"}`}>
                    <GIcon icon={icons[n.type] ?? Bell} size={SizeEnum.md} color={n.read ? AccentColorEnum.Muted : AccentColorEnum.Primary} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold truncate ${n.read ? "text-text-secondary" : "text-text"}`}>{n.title}</h3>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className={`text-sm mt-0.5 line-clamp-2 ${n.read ? "text-text-muted" : "text-text-secondary"}`}>{n.desc}</p>
                    <p className="text-xs text-text-muted mt-1">{n.time}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {n.onAction && (
                      <GButton
                        size={SizeEnum.md}
                        variant={n.type === "GameInvite" || n.type === "FriendRequest" ? ButtonVariantEnum.Primary : ButtonVariantEnum.Subtle}
                        onClick={n.onAction}>
                        {n.type === "FriendRequest" || n.type === "GameInvite" ? <Check size={16} /> : <CheckCheck size={16} />}
                      </GButton>
                    )}
                    {n.onDismiss && (
                      <GButton size={SizeEnum.md} variant={ButtonVariantEnum.Subtle} onClick={n.onDismiss}>
                        <X size={16} />
                      </GButton>
                    )}
                    {!n.onAction && !n.onDismiss && n.read && (
                      <GButton
                        size={SizeEnum.md}
                        variant={ButtonVariantEnum.Subtle}
                        onClick={() => notificationService.deleteNotification(n.id)}
                        className="text-text-muted hover:text-danger">
                        <Trash2 size={16} />
                      </GButton>
                    )}
                  </div>
                </div>
              </GCard>
            )}
          </GList>
        )}
      </GAsync>
    </GPage>
  );
}
