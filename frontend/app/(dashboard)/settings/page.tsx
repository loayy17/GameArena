"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Lock, Settings, User } from "lucide-react";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type TSettingsTranslation } from "./i18n/en.i18n";
import { en as EnTextField, type GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { GPage } from "@/component/common/GPage";
import { GIcon } from "@/component/common/GIcon";
import { GAsync } from "@/component/common/GAsync";
import { useAuth } from "@/app/providers/AuthProvider";
import { SettingsTabEnum } from "@/domain/enum/SettingsTabEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { PageHeader } from "@/component/common/PageHeader";
import { GTabs } from "@/component/common/GTabs";
import { IGTabItem } from "@/component/common/def/GTabs";
import { ProfileTab } from "@/component/settings/ProfileTab";
import { PasswordTab } from "@/component/settings/PasswordTab";
import { PreferencesTab } from "@/component/settings/PreferencesTab";
import type { TNullable } from "@/domain/type/TCommon";

function SettingsContent({ user }: { user: NonNullable<ReturnType<typeof useAuth>["user"]> }) {
  const t = useTranslation({ en: { ...en, ...EnTextField }, ar: { ...ar, ...ArTextField }, fr: { ...fr, ...FrTextField } }) as TSettingsTranslation &
    GTextFieldTranslation;
  const [activeTab, setActiveTab] = useState<SettingsTabEnum>(SettingsTabEnum.Profile);
  const [saveMsg, setSaveMsg] = useState<TNullable<string>>(null);
  const timerRef = useRef<TNullable<ReturnType<typeof setTimeout>>>(null);
  const showMessage = useCallback((msg: string) => {
    setSaveMsg(msg);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSaveMsg(null), 3000);
  }, []);
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const navItems = useMemo<IGTabItem[]>(
    () =>
      [
        { id: SettingsTabEnum.Profile, label: t.settings.profile.title, icon: <GIcon icon={User} size={SizeEnum.md} /> },
        { id: SettingsTabEnum.Password, label: t.settings.password.title, icon: <GIcon icon={Lock} size={SizeEnum.md} /> },
        { id: SettingsTabEnum.Preferences, label: t.settings.preferences.title, icon: <GIcon icon={Settings} size={SizeEnum.md} /> },
      ].map((item) => ({ ...item, active: activeTab === item.id, onClick: () => setActiveTab(item.id) })),
    [t, activeTab],
  );

  return (
    <GPage size={SizeEnum.xl}>
      <PageHeader icon={Settings} title={t.title} subtitle={t.settings.profile.subtitle} />
      {saveMsg && (
        <div role="status" className="mb-6 rounded-xl border border-success bg-success-bg p-4 text-center text-sm text-success">
          {saveMsg}
        </div>
      )}
      <GTabs tabs={navItems} value={activeTab} responsive fullWidth onChange={(id) => setActiveTab(id as SettingsTabEnum)} />
      {activeTab === SettingsTabEnum.Profile && <ProfileTab user={user} showMessage={showMessage} t={t} />}
      {activeTab === SettingsTabEnum.Password && <PasswordTab showMessage={showMessage} t={t} />}
      {activeTab === SettingsTabEnum.Preferences && <PreferencesTab user={user} showMessage={showMessage} t={t} />}
    </GPage>
  );
}

function SettingsPage() {
  const { user } = useAuth();
  if (!user)
    return (
      <GPage size={SizeEnum.xl}>
        <GAsync loading spinnerSize={SizeEnum.md} className="py-10" />
      </GPage>
    );
  return <SettingsContent key={user.id} user={user} />;
}

export default SettingsPage;
