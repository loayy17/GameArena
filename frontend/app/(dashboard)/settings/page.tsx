"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TSettingsTranslation } from "./i18n/en.i18n";
import { GTabs } from "@/component/common/GTabs";
import { User, Bell, Shield, Save } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import { GTabItem } from "@/component/common/def/GTabs";
import { GCard } from "@/component/common/GCard";
import { GTextField } from "@/component/common/GTextField";
import { GTextarea } from "@/component/common/GTextarea";
import { GCheckbox } from "@/component/common/GCheckbox";
import { GBadge } from "@/component/common/GBadge";
import { GIcon } from "@/component/common/GIcon";

type SettingsTab = "profile" | "notifications" | "privacy";

function SettingsPage() {
  const t = useTranslation({ en, ar }) as TSettingsTranslation;
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const tabs = useMemo<GTabItem<SettingsTab>[]>(
    () => [
      {
        id: "profile",
        label: t.settings.profile.title,
        icon: <User size={18} />,
      },
      {
        id: "notifications",
        label: t.settings.notifications.title,
        icon: <Bell size={18} />,
      },
      {
        id: "privacy",
        label: t.settings.privacy.title,
        icon: <Shield size={18} />,
      },
    ],
    [t],
  );

  const notificationItems = [
    { key: "push", label: t.settings.notifications.push },
    { key: "email", label: t.settings.notifications.email },
    { key: "friendRequests", label: t.settings.notifications.friendRequests },
    { key: "gameInvites", label: t.settings.notifications.gameInvites },
  ] as const;

  const settingRow = "flex items-center justify-between py-2 border-b border-border/50 last:border-0";

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
      <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-e border-border bg-bg-sidebar">
        <div className="p-4 lg:p-6">
          <h1 className="text-2xl font-bold text-text mb-4 lg:mb-8">
            {t.title}
          </h1>
          <GTabs
            tabs={tabs}
            value={activeTab}
            onChange={setActiveTab}
            direction="V"
            variant="sidebar"
            indicator="start"
            fullWidth
          />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 bg-bg">
        <div className="max-w-2xl mx-auto">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <GCard padding="lg">
                <h2 className="text-xl font-bold text-text mb-4">
                  {t.settings.profile.title}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <GTextField
                    label={t.settings.profile.firstName}
                    defaultValue="John"
                  />
                  <GTextField
                    label={t.settings.profile.lastName}
                    defaultValue="Doe"
                  />
                  <div className="sm:col-span-2">
                    <GTextField
                      label={t.settings.profile.username}
                      defaultValue="johndoe"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <GTextarea
                      label={t.settings.profile.bio}
                      rows={3}
                      defaultValue="A passionate gamer who loves strategy games."
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <GButton leftIcon={<GIcon icon={Save} size="sm" color="inherit" className="text-on-primary" />}>
                    {t.settings.profile.save}
                  </GButton>
                </div>
              </GCard>

              <GCard padding="lg">
                <h3 className="text-lg font-semibold text-text mb-3">
                  {t.settings.profile.linkedAccounts}
                </h3>
                <div className="space-y-3">
                  <div className={settingRow}>
                    <span className="text-sm text-text">Discord</span>
                    <GBadge variant="success">{t.settings.profile.connected}</GBadge>
                  </div>
                  <div className={settingRow}>
                    <span className="text-sm text-text">Google</span>
                    <GBadge variant="muted">{t.settings.profile.notConnected}</GBadge>
                  </div>
                  <div className={settingRow}>
                    <span className="text-sm text-text">Twitch</span>
                    <GBadge variant="success">{t.settings.profile.connected}</GBadge>
                  </div>
                </div>
              </GCard>
            </div>
          )}

          {activeTab === "notifications" && (
            <GCard padding="lg" className="space-y-5">
              <h2 className="text-xl font-bold text-text">
                {t.settings.notifications.title}
              </h2>
              <div className="space-y-4">
                {notificationItems.map((item) => (
                  <label key={item.key} className={settingRow}>
                    <span className="text-sm text-text">{item.label}</span>
                    <GCheckbox defaultChecked={item.key !== "email"} />
                  </label>
                ))}
              </div>
              <div className="flex justify-end">
                <GButton>{t.settings.notifications.save}</GButton>
              </div>
            </GCard>
          )}

          {activeTab === "privacy" && (
            <GCard padding="lg" className="space-y-5">
              <h2 className="text-xl font-bold text-text">
                {t.settings.privacy.title}
              </h2>
              <div className="space-y-4">
                <label className={settingRow}>
                  <span className="text-sm text-text">
                    {t.settings.privacy.showOnline}
                  </span>
                  <GCheckbox defaultChecked />
                </label>
                <label className={settingRow}>
                  <span className="text-sm text-text">
                    {t.settings.privacy.allowFriendRequests}
                  </span>
                  <GCheckbox defaultChecked />
                </label>
                <label className={settingRow}>
                  <span className="text-sm text-text">
                    {t.settings.privacy.showGameActivity}
                  </span>
                  <GCheckbox />
                </label>
              </div>
              <div className="flex justify-end">
                <GButton>{t.settings.privacy.save}</GButton>
              </div>
            </GCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
