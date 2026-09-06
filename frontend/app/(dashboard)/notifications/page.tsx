"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, MessageSquare, Trash2, X } from "lucide-react";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useNotificationList, notificationTypeIcon } from "@/hooks/useNotificationList";
import { GTabs } from "@/component/common/GTabs";
import { GCard } from "@/component/common/GCard";
import { GPage } from "@/component/common/GPage";
import { GIcon } from "@/component/common/GIcon";
import { GList } from "@/component/common/GList";
import { GPageHeader } from "@/component/common/GPageHeader";
import { GButton } from "@/component/common/GButton";
import { GEmpty } from "@/component/common/GEmpty";
import { GAsync } from "@/component/common/GAsync";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { CardVariantEnum } from "@/domain/enum/CardVariantEnum";
import { NotificationTypeEnum } from "@/domain/enum/NotificationTypeEnum";

import type { TNotificationTab } from "./def/NotificationsPage";

export default function NotificationsPage() {
  const [tab, setTab] = useState<TNotificationTab>("all");
  const { t, tabs, items, unreadCount } = useNotificationList(tab);
  const { markAllNotificationsRead, deleteNotification, loading: requestsLoading } = useDashboardData();

  return (
    <GPage size={SizeEnum.lg}>
      <GPageHeader icon={Bell} title={t.title} subtitle={t.subtitle} className="hidden md:block" />
      {tab === "all" && unreadCount > 0 && (
        <div className="-mt-3 mb-3 flex flex-wrap justify-end">
          <GButton size={SizeEnum.md} variant={ButtonVariantEnum.Subtle} onClick={markAllNotificationsRead}>
            <CheckCheck size={16} />
            <span className="ms-1">{t.markAllRead}</span>
          </GButton>
        </div>
      )}
      <GTabs tabs={tabs} value={tab} onChange={setTab} tabClassName="w-full md:flex-1 md:justify-center" />
      <GAsync loading={tab === "friendRequests" && requestsLoading} spinnerSize={SizeEnum.md} errorTitle={t.error.title} className="py-16">
        {items.length === 0 ? (
          <GEmpty
            icon={<GIcon icon={Bell} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}
            title={t.empty.title}
            description={t.empty.description}
          />
        ) : (
          <GList
            items={items}
            keyExtractor={(n) => n.id}
            pageSize={10}
            listClassName="gap-3"
            emptyMessage={t.empty.title}
            emptyDescription={t.empty.description}
            emptyIcon={<GIcon icon={Bell} size={SizeEnum.xl} color={AccentColorEnum.Muted} />}>
            {(n) => (
              <GCard
                variant={n.read ? CardVariantEnum.Default : CardVariantEnum.Interactive}
                className={n.read ? "opacity-60" : ""}
                onClick={n.onClick}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${n.read ? "bg-surface" : "bg-primary-muted"}`}>
                    <GIcon
                      icon={notificationTypeIcon[n.type] ?? Bell}
                      size={SizeEnum.md}
                      color={n.read ? AccentColorEnum.Muted : AccentColorEnum.Primary}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`truncate font-semibold ${n.read ? "text-text-secondary" : "text-text"}`}>{n.title}</h3>
                      {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <p className={`mt-0.5 line-clamp-2 wrap-anywhere text-sm ${n.read ? "text-text-muted" : "text-text-secondary"}`}>{n.desc}</p>
                    <p className="mt-1 text-xs text-text-muted">{n.time}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    {n.onAction && (
                      <GButton
                        icon={n.type === NotificationTypeEnum.GameInvite || n.type === NotificationTypeEnum.FriendRequest ? Check : MessageSquare}
                        label={n.type === NotificationTypeEnum.GameInvite || n.type === NotificationTypeEnum.FriendRequest ? t.actions.accept : t.actions.reply}
                        size={SizeEnum.sm}
                        variant={
                          n.type === NotificationTypeEnum.GameInvite || n.type === NotificationTypeEnum.FriendRequest
                            ? ButtonVariantEnum.Primary
                            : ButtonVariantEnum.Subtle
                        }
                        onClick={n.onAction}
                      />
                    )}
                    {n.onDismiss && (
                      <GButton icon={X} label={t.actions.dismiss} size={SizeEnum.sm} variant={ButtonVariantEnum.Subtle} onClick={n.onDismiss} />
                    )}
                    {!n.onAction && !n.onDismiss && n.read && (
                      <GButton
                        icon={Trash2}
                        label={t.actions.dismiss}
                        size={SizeEnum.sm}
                        variant={ButtonVariantEnum.Subtle}
                        onClick={async () => {
                          deleteNotification(n.id);
                        }}
                        className="text-text-muted hover:text-danger">
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
