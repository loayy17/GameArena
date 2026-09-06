"use client";

import { useMemo, useState } from "react";
import { Activity, Bell, Gamepad2, Languages, List, Moon, Save, Volume2 } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { GSwitch } from "@/component/common/GSwitch";
import { GSelect } from "@/component/common/GSelect";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useAuth } from "@/app/providers/AuthProvider";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { useLocale, useTheme } from "@/hooks/useSetting";
import { userService } from "@/services/def/UserService";
import { DEFAULT_USER_PREFERENCES } from "@/domain/meta/IUserPreferences";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";

import type { IUserPreferences } from "@/domain/meta/IUserPreferences";
import type { IPrefRowProps, IPreferencesTabProps } from "./def/SettingsTabs";

const parsePreferences = (raw?: string): IUserPreferences => {
  try {
    const parsed = JSON.parse(raw ?? "{}") as IUserPreferences;
    return { ...DEFAULT_USER_PREFERENCES, ...parsed };
  } catch {
    return DEFAULT_USER_PREFERENCES;
  }
};

function PrefRow({ icon, label, control }: IPrefRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm text-text">{label}</span>
      </div>
      {control}
    </div>
  );
}

export function PreferencesTab({ user, showMessage, t }: IPreferencesTabProps) {
  const resolveError = useErrorMessage();
  const { updatePreferences } = useAuth();
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useLocale();
  const [prefSaving, setPrefSaving] = useState(false);
  const [preferences, setPreferences] = useState<IUserPreferences>(() => parsePreferences(user.preferences));

  const isDirty = useMemo(() => {
    const merged = parsePreferences(user.preferences);
    if (theme !== String(merged.theme)) return true;
    if (locale !== String(merged.locale)) return true;
    for (const k of Object.keys(preferences) as Array<keyof IUserPreferences>) if (preferences[k] !== merged[k]) return true;
    return false;
  }, [preferences, theme, locale, user]);

  const handleSave = async () => {
    setPrefSaving(true);
    try {
      const toPersist: IUserPreferences = { ...preferences, theme: theme as IUserPreferences["theme"], locale: locale as IUserPreferences["locale"] };
      await userService.updatePreferences({ preferences: JSON.stringify(toPersist) });
      updatePreferences(toPersist);
      showMessage(t.settings.preferences.saved, "success");
    } catch (e: unknown) {
      showMessage(resolveError(toErrorCode(e), t.settings.preferences.saveFailed), "danger");
    }
    setPrefSaving(false);
  };

  const togglePref = (key: keyof IUserPreferences) => {
    const next = !preferences[key];
    setPreferences((prev) => ({ ...prev, [key]: next }));
    updatePreferences({ [key]: next });
  };

  const pageSizeOptions = [5, 10, 15, 20, 25];
  const prefItems: { key: keyof IUserPreferences; label: string; icon: React.ReactNode }[] = [
    { key: "soundEnabled", label: t.settings.preferences.sound, icon: <GIcon icon={Volume2} size={SizeEnum.sm} /> },
    { key: "showOnlineStatus", label: t.settings.preferences.showOnline, icon: <GIcon icon={Activity} size={SizeEnum.sm} /> },
    { key: "showGameActivity", label: t.settings.preferences.showGameActivity, icon: <GIcon icon={Gamepad2} size={SizeEnum.sm} /> },
    { key: "showNotifications", label: t.settings.preferences.showNotifications, icon: <GIcon icon={Bell} size={SizeEnum.sm} /> },
  ];

  return (
    <div className="space-y-2">
      <PrefRow
        icon={<GIcon icon={Moon} size={SizeEnum.sm} />}
        label={t.settings.preferences.darkMode}
        control={
          <GSwitch
            aria-label={t.settings.preferences.darkMode}
            checked={theme === ThemeEnum.Dark}
            onChange={(e) => setTheme(e.target.checked ? ThemeEnum.Dark : ThemeEnum.Light)}
          />
        }
      />
      <PrefRow
        icon={<GIcon icon={Languages} size={SizeEnum.sm} />}
        label={t.settings.preferences.language}
        control={
          <GSelect
            className="w-36"
            aria-label={t.settings.preferences.language}
            value={locale}
            options={[
              { value: LocaleEnum.En, label: "English" },
              { value: LocaleEnum.Ar, label: "العربية" },
              { value: LocaleEnum.Fr, label: "Français" },
            ]}
            onChange={(e) => setLocale(e.target.value as LocaleEnum)}
          />
        }
      />
      {prefItems.map((item) => (
        <PrefRow
          key={item.key}
          icon={item.icon}
          label={item.label}
          control={<GSwitch aria-label={item.label} checked={preferences[item.key] as boolean} onChange={() => togglePref(item.key)} />}
        />
      ))}
      <PrefRow
        icon={<GIcon icon={List} size={SizeEnum.sm} />}
        label={t.settings.preferences.recordsPerPage}
        control={
          <GSelect
            className="w-20"
            aria-label={t.settings.preferences.recordsPerPage}
            value={preferences.pageSize}
            options={pageSizeOptions.map((n) => ({ value: n, label: `${n}` }))}
            onChange={(e) => setPreferences((prev) => ({ ...prev, pageSize: +e.target.value }))}
          />
        }
      />
      <div className="flex justify-end pt-4">
        <GButton
          loading={prefSaving}
          disabled={!isDirty}
          startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}
          onClick={() => void handleSave()}>
          {t.settings.preferences.save}
        </GButton>
      </div>
    </div>
  );
}
