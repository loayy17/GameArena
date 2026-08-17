"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Save, User, Lock, Settings, Moon, Volume2, Activity, Gamepad2, Languages, Bell, List } from "lucide-react";
import { useTranslation, useTheme, useLocale } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en, type TSettingsTranslation } from "./i18n/en.i18n";
import { en as EnTextField, type GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { GButton } from "@/component/common/GButton";
import { GPage } from "@/component/common/GPage";
import { GTextField } from "@/component/common/GTextField";
import { GSelect } from "@/component/common/GSelect";
import { GIcon } from "@/component/common/GIcon";
import { GAsync } from "@/component/common/GAsync";
import { userService } from "@/services/def/UserService";
import { DEFAULT_USER_PREFERENCES, type IUserPreferences } from "@/domain/meta/IUserPreferences";
import { passwordValidator } from "@/lib/utils";
import { useAuth } from "@/app/providers/AuthProvider";
import { useErrorMessage, toErrorCode } from "@/hooks/useErrorMessage";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import type { TNullable } from "@/domain/type/TCommon";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { SettingsTabEnum } from "@/domain/enum/SettingsTabEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { PageHeader } from "@/component/common/PageHeader";
import { GTabs } from "@/component/common/GTabs";
import { IGTabItem } from "@/component/common/def/GTabs";

function SettingsPage() {
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
    fr: { ...fr, ...FrTextField },
  }) as TSettingsTranslation & GTextFieldTranslation;
  const resolveError = useErrorMessage();
  const [activeTab, setActiveTab] = useState<SettingsTabEnum>(SettingsTabEnum.Profile);
  const { user, updatePreferences, refreshUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<TNullable<string>>(null);

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [userName, setUserName] = useState(user?.userName ?? "");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [preferences, setPreferences] = useState<IUserPreferences>(() => {
    try {
      const parsed = JSON.parse(user?.preferences ?? "{}") as IUserPreferences;
      return { ...DEFAULT_USER_PREFERENCES, ...parsed } as IUserPreferences;
    } catch {
      return DEFAULT_USER_PREFERENCES;
    }
  });
  const [prefSaving, setPrefSaving] = useState(false);
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useLocale();

  const showMessage = useCallback((msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 3000);
  }, []);

  useEffect(() => {
    if (!user) return;
    try {
      const parsed = JSON.parse(user.preferences ?? "{}") as IUserPreferences;
      if (parsed.theme === ThemeEnum.Light || parsed.theme === ThemeEnum.Dark) setTheme(parsed.theme);
      if (parsed.locale === LocaleEnum.En || parsed.locale === LocaleEnum.Ar || parsed.locale === LocaleEnum.Fr) setLocale(parsed.locale);
    } catch {}
  }, [user, setLocale, setTheme]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await userService.updateProfile({
        firstName,
        lastName,
        userName,
        email: user.email,
        password: null,
      });
      await refreshUser();
      showMessage(t.settings.profile.saved);
    } catch (e: unknown) {
      showMessage(resolveError(toErrorCode(e), t.settings.profile.saveFailed));
    }
    setSaving(false);
  };

  const validatePassword = (): boolean => {
    const errs: Record<string, string> = {};
    if (!oldPassword.trim()) errs.oldPassword = t.dynamicFieldRequired(t.settings.password.oldPassword);
    const pwErr = passwordValidator(t)(newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (!confirmPassword.trim()) {
      errs.confirmPassword = t.dynamicFieldRequired(t.settings.password.confirmPassword);
    } else if (newPassword !== confirmPassword) {
      errs.confirmPassword = t.invalidConfirmPassword;
    }
    setPasswordErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSavePassword = async () => {
    if (!validatePassword()) return;
    setSaving(true);
    try {
      await userService.changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
      showMessage(t.settings.password.saved);
    } catch (e: unknown) {
      const code = toErrorCode(e);
      if (code === ErrorCodeEnum.InvalidCredentials) {
        setPasswordErrors({ oldPassword: t.settings.password.invalidCurrentPassword });
      } else {
        showMessage(resolveError(code, t.settings.password.saveFailed));
      }
    }
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setPrefSaving(true);
    try {
      const toPersist: IUserPreferences = {
        ...preferences,
        theme: theme as IUserPreferences["theme"],
        locale: locale as IUserPreferences["locale"],
      };
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

  const navItems = useMemo<IGTabItem[]>(
    () =>
      [
        { id: SettingsTabEnum.Profile, label: t.settings.profile.title, icon: <GIcon icon={User} size={SizeEnum.md} /> },
        { id: SettingsTabEnum.Password, label: t.settings.password.title, icon: <GIcon icon={Lock} size={SizeEnum.md} /> },
        { id: SettingsTabEnum.Preferences, label: t.settings.preferences.title, icon: <GIcon icon={Settings} size={SizeEnum.md} /> },
      ].map((item) => ({
        ...item,
        active: activeTab === item.id,
        onClick: () => setActiveTab(item.id),
      })),
    [t, activeTab],
  );

  const pageSizeOptions = [5, 10, 15, 20, 25];

  const prefItems: { key: keyof IUserPreferences; label: string; icon: React.ReactNode }[] = [
    { key: "soundEnabled", label: t.settings.preferences.sound, icon: <GIcon icon={Volume2} size={SizeEnum.sm} /> },
    {
      key: "showOnlineStatus",
      label: t.settings.preferences.showOnline,
      icon: <GIcon icon={Activity} size={SizeEnum.sm} />,
    },
    {
      key: "showGameActivity",
      label: t.settings.preferences.showGameActivity,
      icon: <GIcon icon={Gamepad2} size={SizeEnum.sm} />,
    },
    {
      key: "showNotifications",
      label: t.settings.preferences.showNotifications,
      icon: <GIcon icon={Bell} size={SizeEnum.sm} />,
    },
  ];

  return (
    <GPage size={SizeEnum.xl} className="py-6 sm:py-8">
      <PageHeader icon={Settings} title={t.title} subtitle={t.settings.profile.subtitle} />

      {saveMsg && (
        <div role="status" className="mb-6 p-4 rounded-xl bg-success-bg border border-success text-success text-sm text-center">
          {saveMsg}
        </div>
      )}

      <GTabs tabs={navItems} value={activeTab} responsive fullWidth onChange={(id) => setActiveTab(id as SettingsTabEnum)} />

      {activeTab === SettingsTabEnum.Profile && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSaveProfile();
          }}
          className="space-y-4">
          <GAsync loading={!user} spinnerSize={SizeEnum.md} className="py-10">
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <GTextField label={t.settings.profile.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <GTextField label={t.settings.profile.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <div className="sm:col-span-2">
                  <GTextField label={t.settings.profile.username} value={userName} onChange={(e) => setUserName(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <GTextField label={t.settings.profile.email} value={user?.email ?? ""} disabled />
                </div>
              </div>
              <div className="flex justify-end">
                <GButton type="submit" loading={saving} loadingText={t.settings.profile.save} startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}>
                  {t.settings.profile.save}
                </GButton>
              </div>
            </>
          </GAsync>
        </form>
      )}

      {activeTab === SettingsTabEnum.Password && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSavePassword();
          }}
          className="space-y-4">
          <GTextField
            label={t.settings.password.oldPassword}
            type="password"
            value={oldPassword}
            error={passwordErrors.oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <GTextField
            label={t.settings.password.newPassword}
            type="password"
            value={newPassword}
            error={passwordErrors.newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <GTextField
            label={t.settings.password.confirmPassword}
            type="password"
            value={confirmPassword}
            error={passwordErrors.confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="flex justify-end">
            <GButton type="submit" loading={saving} loadingText={t.settings.password.save} startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}>
              {t.settings.password.save}
            </GButton>
          </div>
        </form>
      )}

      {activeTab === SettingsTabEnum.Preferences && (
        <div className="space-y-2">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <GIcon icon={Moon} size={SizeEnum.sm} />
              <span className="text-sm text-text">{t.settings.preferences.darkMode}</span>
            </div>
            <GTextField
              type="checkbox"
              className="px-6"
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
              <GTextField
                type="checkbox"
                className="px-6"
                aria-label={item.label}
                checked={preferences[item.key] as boolean}
                onChange={() => togglePref(item.key)}
              />
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
            <GButton
              loading={prefSaving}
              loadingText={t.settings.preferences.save}
              startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}
              onClick={() => void handleSavePreferences()}>
              {t.settings.preferences.save}
            </GButton>
          </div>
        </div>
      )}
    </GPage>
  );
}

export default SettingsPage;
