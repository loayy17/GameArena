"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation, useTheme, useLocale } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TSettingsTranslation } from "./i18n/en.i18n";
import { en as EnTextField, type GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { GTabs } from "@/component/common/GTabs";
import { Save, User, Lock, Settings, Moon, Volume2, Activity, Gamepad2, Sliders, Languages, Bell } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import type { GTabItem } from "@/component/common/def/GTabs";
import { GCard } from "@/component/common/GCard";
import { GTextField } from "@/component/common/GTextField";
import { GSelect } from "@/component/common/GSelect";
import { GIcon } from "@/component/common/GIcon";
import { GSpinner } from "@/component/common/GSpinner";
import { userRepository } from "@/repositories/def/UserRepository";
import type { IUser } from "@/domain/meta/IUser";
import { DEFAULT_USER_PREFERENCES, type IUserPreferences} from "@/domain/meta/IUserPreferences";
import { passwordValidator } from "@/utils";

type SettingsTab = "profile" | "password" | "preferences";

function SettingsPage() {
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TSettingsTranslation & GTextFieldTranslation;
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  const [profile, setProfile] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  const [preferences, setPreferences] = useState<IUserPreferences>(DEFAULT_USER_PREFERENCES);
  const [prefSaving, setPrefSaving] = useState(false);
  const [theme, setTheme] = useTheme();
  const [locale, setLocale] = useLocale();

  const showMessage = useCallback((msg: string) => {
    setSaveMsg(msg);
    setTimeout(() => setSaveMsg(null), 3000);
  }, []);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      setLoading(true);
      const res = await userRepository.profile();
      if (!alive) return;
      if (res.data) {
        setProfile(res.data);
        setFirstName(res.data.firstName ?? "");
        setLastName(res.data.lastName ?? "");
        setUserName(res.data.userName ?? "");
        if (res.data.preferences) {
          try {
            const parsed = JSON.parse(res.data.preferences) as IUserPreferences;
            const merged = { ...DEFAULT_USER_PREFERENCES, ...parsed } as IUserPreferences;
            setPreferences(merged);
            if (merged.theme === "light" || merged.theme === "dark") setTheme(merged.theme);
            if (merged.locale === "en" || merged.locale === "ar") setLocale(merged.locale);
          } catch {
            // fall back to defaults
          }
        }
      }
      setLoading(false);
    };
    void load();
    return () => {
      alive = false;
    };
  }, [setLocale, setTheme]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    await userRepository.updateProfile({
      firstName,
      lastName,
      userName,
      email: profile.email,
      password: null,
    });
    setSaving(false);
    showMessage(t.settings.profile.saved);
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
      await userRepository.changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordErrors({});
      showMessage(t.settings.password.saved);
    } catch {
      setPasswordErrors({ oldPassword: t.settings.password.invalidCurrentPassword });
    }
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setPrefSaving(true);
    // theme/locale are applied live via useSetting; persist the canonical values.
    const toPersist: IUserPreferences = {
      ...preferences,
      theme: theme as IUserPreferences["theme"],
      locale: locale as IUserPreferences["locale"],
    };
    await userRepository.updatePreferences({ preferences: JSON.stringify(toPersist) });
    setPrefSaving(false);
    showMessage(t.settings.preferences.saved);
  };

  const togglePref = (key: keyof IUserPreferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const tabs = useMemo<GTabItem<SettingsTab>[]>(
    () => [
      {
        id: "profile",
        label: t.settings.profile.title,
        icon: <GIcon icon={User} size="md" color="inherit" />,
      },
      {
        id: "password",
        label: t.settings.password.title,
        icon: <GIcon icon={Lock} size="md" color="inherit" />,
      },
      {
        id: "preferences",
        label: t.settings.preferences.title,
        icon: <GIcon icon={Settings} size="md" color="inherit" />,
      },
    ],
    [t],
  );

  const prefItems: { key: keyof IUserPreferences; label: string; icon: React.ReactNode }[] = [
    { key: "soundEnabled", label: t.settings.preferences.sound, icon: <GIcon icon={Volume2} size="sm" color="inherit" /> },
    { key: "showOnlineStatus", label: t.settings.preferences.showOnline, icon: <GIcon icon={Activity} size="sm" color="inherit" /> },
    { key: "showGameActivity", label: t.settings.preferences.showGameActivity, icon: <GIcon icon={Gamepad2} size="sm" color="inherit" /> },
    { key: "showNotifications", label: t.settings.preferences.showNotifications, icon: <GIcon icon={Bell} size="sm" color="inherit" /> },
  ];

  return (
    <div className="h-full flex flex-col lg:flex-row overflow-hidden">
        <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-e border-border bg-bg-sidebar">
          <div className="p-4 lg:p-6">
            <div className="mb-8">
              <header className="flex items-center gap-3">
                <GIcon icon={Settings} size="xl" tile tileSize="xl" tileGradient="bg-primary" tileColor="on-primary" />
                <div className="flex-1">
                  <h1 className="text-2xl font-extrabold text-text tracking-tight leading-tight">{t.title}</h1>
                </div>
              </header>
            </div>
            <GTabs tabs={tabs} value={activeTab} onChange={setActiveTab} direction="V" variant="sidebar" indicator="start" fullWidth />
          </div>
        </aside>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8 bg-bg">
        <div className="max-w-2xl mx-auto w-full">
          {saveMsg && (
            <div className="mb-6 p-4 rounded-xl bg-success-bg border border-success text-success text-sm text-center">{saveMsg}</div>
          )}

          {activeTab === "profile" && (
            <GCard variant="elevated" padding="xl" className="animate-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <GIcon icon={User} size="lg" color="primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{t.settings.profile.title}</h2>
                  <p className="text-sm text-text-muted">{t.settings.profile.subtitle}</p>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <GSpinner />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GTextField label={t.settings.profile.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <GTextField label={t.settings.profile.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <div className="sm:col-span-2">
                      <GTextField label={t.settings.profile.username} value={userName} onChange={(e) => setUserName(e.target.value)} />
                    </div>
                    <div className="sm:col-span-2">
                      <GTextField label={t.settings.profile.email} value={profile?.email ?? ""} disabled />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <GButton
                      leftIcon={saving ? <GSpinner size="sm" /> : <GIcon icon={Save} size="sm" color="inherit" className="text-on-primary" />}
                      onClick={handleSaveProfile}
                      disabled={saving}>
                      {t.settings.profile.save}
                    </GButton>
                  </div>
                </>
              )}
            </GCard>
          )}

          {activeTab === "password" && (
            <GCard variant="elevated" padding="xl" className="animate-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-warning/10 rounded-xl">
                  <GIcon icon={Lock} size="lg" color="warning" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{t.settings.password.title}</h2>
                  <p className="text-sm text-text-muted">{t.settings.password.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4 max-w-sm">
                <GTextField
                  label={t.settings.password.oldPassword}
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  error={passwordErrors.oldPassword}
                />
                <GTextField
                  label={t.settings.password.newPassword}
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  error={passwordErrors.newPassword}
                />
                <GTextField
                  label={t.settings.password.confirmPassword}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={passwordErrors.confirmPassword}
                />
              </div>

              <div className="mt-8 flex justify-end">
                <GButton
                  leftIcon={saving ? <GSpinner size="sm" /> : <GIcon icon={Save} size="sm" color="inherit" className="text-on-primary" />}
                  onClick={handleSavePassword}
                  disabled={saving}>
                  {t.settings.password.save}
                </GButton>
              </div>
            </GCard>
          )}

          {activeTab === "preferences" && (
            <GCard variant="elevated" padding="xl" className="space-y-6 animate-in">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-accent/10 rounded-xl">
                  <GIcon icon={Sliders} size="lg" color="accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-text">{t.settings.preferences.title}</h2>
                  <p className="text-sm text-text-muted">{t.settings.preferences.subtitle}</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between py-3 border-b border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface rounded-lg group-hover:bg-primary/10 transition-colors">
                      <GIcon icon={Moon} size="sm" color="inherit" />
                    </div>
                    <span className="text-sm text-text">{t.settings.preferences.darkMode}</span>
                  </div>
                  <GTextField
                    type="checkbox"
                    className="w-5 h-5 p-0 m-0"
                    checked={theme === "dark"}
                    onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                  />
                </label>

                <div className="flex items-center justify-between py-3 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface rounded-lg">
                      <GIcon icon={Languages} size="sm" color="inherit" />
                    </div>
                    <span className="text-sm text-text">{t.settings.preferences.language}</span>
                  </div>
                  <GSelect
                    className="w-36"
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as "en" | "ar")}
                    options={[
                      { value: "en", label: "English" },
                      { value: "ar", label: "العربية" },
                    ]}
                  />
                </div>

                {prefItems.map((item) => (
                  <label key={item.key} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-surface rounded-lg group-hover:bg-primary/10 transition-colors">{item.icon}</div>
                      <span className="text-sm text-text">{item.label}</span>
                    </div>
                    <GTextField
                      type="checkbox"
                      className="w-5 h-5 p-0 m-0"
                      checked={preferences[item.key] as boolean}
                      onChange={() => togglePref(item.key)}
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <GButton
                  leftIcon={prefSaving ? <GSpinner size="sm" /> : <GIcon icon={Save} size="sm" color="inherit" className="text-on-primary" />}
                  onClick={handleSavePreferences}
                  disabled={prefSaving}>
                  {t.settings.preferences.save}
                </GButton>
              </div>
            </GCard>
          )}
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
