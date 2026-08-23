"use client";

import { useMemo, useState } from "react";
import { Activity, Bell, Gamepad2, List, Languages, Moon, Save, Volume2 } from "lucide-react";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GSwitch } from "@/component/common/GSwitch";
import { GSelect } from "@/component/common/GSelect";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useAuth } from "@/app/providers/AuthProvider";
import { useErrorMessage, toErrorCode } from "@/hooks/useErrorMessage";
import { useTheme, useLocale } from "@/hooks/useSetting";
import { userService } from "@/services/def/UserService";
import { DEFAULT_USER_PREFERENCES, type IUserPreferences } from "@/domain/meta/IUserPreferences";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";

export function PreferencesTab({
  user,
  showMessage,
  t,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  showMessage: (msg: string) => void;
  t: any;
}) {
  const resolveError = useErrorMessage();
  const { updatePreferences } = useAuth();
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useLocale();
  const [prefSaving, setPrefSaving] = useState(false);
  const [preferences, setPreferences] = useState<IUserPreferences>(() => {
    try {
      const parsed = JSON.parse(user.preferences ?? "{}") as IUserPreferences;
      return { ...DEFAULT_USER_PREFERENCES, ...parsed } as IUserPreferences;
    } catch {
      return DEFAULT_USER_PREFERENCES;
    }
  });

  const isDirty = useMemo(() => {
    try {
      const parsed = JSON.parse(user.preferences ?? "{}") as IUserPreferences;
      const merged = { ...DEFAULT_USER_PREFERENCES, ...parsed } as IUserPreferences;
      if (theme !== String(merged.theme)) return true;
      if (locale !== String(merged.locale)) return true;
      for (const k of Object.keys(preferences) as Array<keyof IUserPreferences>) if (preferences[k] !== merged[k]) return true;
      return false;
    } catch {
      return true;
    }
  }, [preferences, theme, locale, user]);

  const handleSave = async () => {
    setPrefSaving(true);
    try {
      const toPersist: IUserPreferences = { ...preferences, theme: theme as IUserPreferences["theme"], locale: locale as IUserPreferences["locale"] };
      await userService.updatePreferences({ preferences: JSON.stringify(toPersist) });
      updatePreferences(toPersist);
      showMessage(t.settings.preferences.saved);
    } catch (e: unknown) {
      showMessage(resolveError(toErrorCode(e), t.settings.preferences.saveFailed));
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
      <div className="flex items-center justify-between py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <GIcon icon={Moon} size={SizeEnum.sm} />
          <span className="text-sm text-text">{t.settings.preferences.darkMode}</span>
        </div>
        <GSwitch
          aria-label={t.settings.preferences.darkMode}
          checked={theme === ThemeEnum.Dark}
          onChange={(e) => setTheme(e.target.checked ? ThemeEnum.Dark : ThemeEnum.Light)}
        />
      </div>
      <div className="flex items-center justify-between py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <GIcon icon={Languages} size={SizeEnum.sm} />
          <span className="text-sm text-text">{t.settings.preferences.language}</span>
        </div>
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
      </div>
      {prefItems.map((item) => (
        <div key={item.key} className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            {item.icon}
            <span className="text-sm text-text">{item.label}</span>
          </div>
          <GSwitch aria-label={item.label} checked={preferences[item.key] as boolean} onChange={() => togglePref(item.key)} />
        </div>
      ))}
      <div className="flex items-center justify-between py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <GIcon icon={List} size={SizeEnum.sm} />
          <span className="text-sm text-text">{t.settings.preferences.recordsPerPage}</span>
        </div>
        <GSelect
          className="w-20"
          aria-label={t.settings.preferences.recordsPerPage}
          value={preferences.pageSize}
          options={pageSizeOptions.map((n) => ({ value: n, label: `${n}` }))}
          onChange={(e) => setPreferences((prev) => ({ ...prev, pageSize: +e.target.value }))}
        />
      </div>
      <div className="flex justify-end pt-4">
        <GButtonAsync
          busy={prefSaving}
          disabled={!isDirty}
          loadingText={t.settings.preferences.save}
          startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}
          onClick={() => void handleSave()}>
          {t.settings.preferences.save}
        </GButtonAsync>
      </div>
    </div>
  );
}
