"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Gamepad2, Users, MessageSquare, X, Check, Trash2, CheckCheck } from "lucide-react";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { notificationService } from "@/services/def/NotificationService";
import { GTabs } from "@/component/common/GTabs";
import { GCard } from "@/component/common/GCard";
import { GPage } from "@/component/common/GPage";
import { GIcon } from "@/component/common/GIcon";
import { PageHeader } from "@/component/common/PageHeader";
import { GButton } from "@/component/common/GButton";
import { GEmpty } from "@/component/common/GEmpty";
import { GSpinner } from "@/component/common/GSpinner";
import { ar } from "./i18n/ar.i18n";
import { en, type TNotificationsTranslation } from "./i18n/en.i18n";
import type { GTabItem } from "@/component/common/def/GTabs";
import type { IGameInvite } from "@/domain/meta/INotification";
import { friendService } from "@/services/def/FriendService";
import type { IFriendRequestReceived } from "@/domain/meta/IFriendRequestReceived";

type Tab = "all" | "gameInvites" | "friendRequests";

function timeAgo(d: Date, t: TNotificationsTranslation) {
  const m = Math.floor((Date.now() - d.getTime()) / 60000);
  if (m < 1) return t.time.justNow;
  if (m < 60) return t.time.minutesAgo.replace("{n}", String(m));
  const h = Math.floor(m / 60);
  if (h < 24) return t.time.hoursAgo.replace("{n}", String(h));
  return t.time.daysAgo.replace("{n}", String(Math.floor(h / 24)));
}

const icons: Record<string, typeof Bell> = { FriendRequest: Users, FriendRequestAccepted: Users, GameInvite: Gamepad2, NewMessage: MessageSquare };

export default function NotificationsPage() {
  const t = useTranslation({ en, ar }) as TNotificationsTranslation;
  const { notifications, gameInvites, dismissGameInvite, acceptGameInvite } = useDashboardNotifications();
  const [tab, setTab] = useState<Tab>("all");
  const [requests, setRequests] = useState<IFriendRequestReceived[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    friendService.getReceivedFriendRequests().then((r) => { if (r.data) setRequests(r.data); }).finally(() => setLoading(false));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const tabs = useMemo<GTabItem<Tab>[]>(() => [
    { id: "all", label: t.tabs.all, icon: <GIcon icon={Bell} size="sm" color="inherit" />, badge: unreadCount || undefined },
    { id: "gameInvites", label: t.tabs.gameInvites, icon: <GIcon icon={Gamepad2} size="sm" color="inherit" />, badge: gameInvites.length || undefined },
    { id: "friendRequests", label: t.tabs.friendRequests, icon: <GIcon icon={Users} size="sm" color="inherit" />, badge: requests.length || undefined },
  ], [t, unreadCount, gameInvites.length, requests.length]);

  const all = useMemo(() => {
    const out: Array<{ id: string; type: string; title: string; desc: string; time: string; read: boolean; onAction?(): void; onDismiss?(): void }> = [];
    for (const n of notifications) {
      out.push({ id: n.id, type: n.type, title: n.title, desc: n.body, time: timeAgo(new Date(n.createdAt), t), read: n.isRead, onAction: n.isRead ? undefined : () => notificationService.markNotificationRead(n.id) });
    }
    for (const g of gameInvites) {
      out.push({ id: `g-${g.roomId}`, type: "GameInvite", title: t.gameInvite.title, desc: t.gameInvite.description.replace("{name}", g.inviterName ?? "Someone").replace("{game}", "Game"), time: timeAgo(new Date(), t), read: false, onAction: () => acceptGameInvite(g.roomId), onDismiss: () => dismissGameInvite(g.roomId) });
    }
    for (const r of requests) {
      const name = `${r.senderFirstName ?? ""} ${r.senderLastName ?? ""}`.trim() || (r.senderUserName ?? "Someone");
      out.push({ id: `fr-${r.senderId}`, type: "FriendRequest", title: t.friendRequest.title, desc: t.friendRequest.description.replace("{name}", name), time: timeAgo(new Date(r.sentAt), t), read: false, onAction: () => friendService.acceptFriendRequest(r.senderId).then(() => setRequests((p) => p.filter((x) => x.senderId !== r.senderId))), onDismiss: () => friendService.rejectFriendRequest(r.senderId).then(() => setRequests((p) => p.filter((x) => x.senderId !== r.senderId))) });
    }
    out.sort((a, b) => Number(a.read) - Number(b.read));
    return out;
  }, [notifications, gameInvites, requests, t]);

  const filtered = useMemo(() => {
    if (tab === "all") return all;
    const m: Record<Tab, string> = { all: "", gameInvites: "GameInvite", friendRequests: "FriendRequest" };
    return all.filter((n) => n.type === m[tab] || (tab === "friendRequests" && n.type === "FriendRequestAccepted"));
  }, [all, tab]);

  return (
    <GPage width="lg">
      <PageHeader icon={Bell} title={t.title} subtitle={t.subtitle} />
      {tab === "all" && unreadCount > 0 && <div className="flex justify-end -mt-3 mb-3"><GButton size="sm" variant="ghost" onClick={() => notificationService.markAllNotificationsRead()}><CheckCheck size={16} /><span className="ms-1">{t.markAllRead}</span></GButton></div>}
      <GCard padding="sm">
        <GTabs tabs={tabs} value={tab} onChange={setTab} variant="pills" fullWidth className="mb-2" />
        {loading && tab === "friendRequests" ? <GSpinner className="mx-auto py-16" />
        : filtered.length === 0 ? <GEmpty icon={<GIcon icon={Bell} size="xl" color="muted" />} title={t.empty.title} description={t.empty.description} />
        : <div className="space-y-2">
            {filtered.map((n) => (
              <GCard key={n.id} variant={n.read ? "default" : "interactive"} padding="md" className={n.read ? "opacity-60" : ""}>
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${n.read ? "bg-surface" : "bg-primary-muted"}`}>
                    <GIcon icon={icons[n.type] ?? Bell} size="md" color={n.read ? "muted" : "primary"} />
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
                    {n.onAction && <GButton size="sm" variant={n.type === "GameInvite" || n.type === "FriendRequest" ? "primary" : "ghost"} onClick={n.onAction}>{n.type === "FriendRequest" || n.type === "GameInvite" ? <Check size={14} /> : <CheckCheck size={14} />}</GButton>}
                    {n.onDismiss && <GButton size="sm" variant="ghost" onClick={n.onDismiss}><X size={14} /></GButton>}
                    {!n.onAction && !n.onDismiss && n.read && <GButton size="sm" variant="ghost" onClick={() => notificationService.deleteNotification(n.id)} className="text-text-muted hover:text-danger"><Trash2 size={14} /></GButton>}
                  </div>
                </div>
              </GCard>
            ))}
          </div>}
      </GCard>
    </GPage>
  );
}
