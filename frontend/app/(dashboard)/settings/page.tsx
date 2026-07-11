"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "@/hooks/useSetting";
import { ar } from "./i18n/ar.i18n";
import { en, type TSettingsTranslation } from "./i18n/en.i18n";
import {
  en as EnTextField,
  type GTextFieldTranslation,
} from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { GTabs } from "@/component/common/GTabs";
import { Save, User, Lock, Settings } from "lucide-react";
import { GButton } from "@/component/common/GButton";
import type { GTabItem } from "@/component/common/def/GTabs";
import { GCard } from "@/component/common/GCard";
import { GTextField } from "@/component/common/GTextField";
import { GCheckbox } from "@/component/common/GCheckbox";
import { GIcon } from "@/component/common/GIcon";
import { GSpinner } from "@/component/common/GSpinner";
import { userRepository } from "@/repositories/def/UserRepository";
import type { IUser } from "@/domain/meta/IUser";
import { DEFAULT_USER_PREFERENCES, type IUserPreferences } from "@/domain/meta/IUserPreferences";
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
            setPreferences({ ...DEFAULT_USER_PREFERENCES, ...parsed });
          } catch {
            // fall back to defaults
          }
        }
      }
      setLoading(false);
    };
    void load();
    return () => { alive = false; };
  }, []);

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
      setPasswordErrors({ oldPassword: "Invalid current password" });
    }
    setSaving(false);
  };

  const handleSavePreferences = async () => {
    setPrefSaving(true);
    await userRepository.updatePreferences({ preferences: JSON.stringify(preferences) });
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

  const settingRow = "flex items-center justify-between py-2 border-b border-border/50 last:border-0";
  const prefItems: { key: keyof IUserPreferences; label: string }[] = [
    { key: "theme", label: t.settings.preferences.theme },
    { key: "soundEnabled", label: t.settings.preferences.sound },
    { key: "showOnlineStatus", label: t.settings.preferences.showOnline },
    { key: "allowFriendRequests", label: t.settings.preferences.allowFriendRequests },
    { key: "showGameActivity", label: t.settings.preferences.showGameActivity },
    { key: "emailNotifications", label: t.settings.preferences.emailNotifications },
    { key: "pushNotifications", label: t.settings.preferences.pushNotifications },
  ];

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
          {saveMsg && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-success-bg border border-success text-success text-sm text-center">
              {saveMsg}
            </div>
          )}

          {activeTab === "profile" && (
            <GCard padding="lg">
              <h2 className="text-xl font-bold text-text mb-4">
                {t.settings.profile.title}
              </h2>

              {loading ? (
                <div className="flex justify-center py-10">
                  <GSpinner />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <GTextField
                      label={t.settings.profile.firstName}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <GTextField
                      label={t.settings.profile.lastName}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <div className="sm:col-span-2">
                      <GTextField
                        label={t.settings.profile.username}
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <GTextField
                        label={t.settings.profile.email}
                        value={profile?.email ?? ""}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <GButton
                      leftIcon={saving ? <GSpinner size="sm" /> : <GIcon icon={Save} size="sm" color="inherit" className="text-on-primary" />}
                      onClick={handleSaveProfile}
                      disabled={saving}
                    >
                      {t.settings.profile.save}
                    </GButton>
                  </div>
                </>
              )}
            </GCard>
          )}

          {activeTab === "password" && (
            <GCard padding="lg">
              <h2 className="text-xl font-bold text-text mb-4">
                {t.settings.password.title}
              </h2>

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

              <div className="mt-6 flex justify-end">
                <GButton
                  leftIcon={saving ? <GSpinner size="sm" /> : <GIcon icon={Save} size="sm" color="inherit" className="text-on-primary" />}
                  onClick={handleSavePassword}
                  disabled={saving}
                >
                  {t.settings.password.save}
                </GButton>
              </div>
            </GCard>
          )}

          {activeTab === "preferences" && (
            <GCard padding="lg" className="space-y-5">
              <h2 className="text-xl font-bold text-text">
                {t.settings.preferences.title}
              </h2>

              <div className="space-y-4">
                {prefItems.map((item) => (
                  <label key={item.key} className={settingRow}>
                    <span className="text-sm text-text">{item.label}</span>
                    <GCheckbox
                      checked={preferences[item.key] as boolean}
                      onChange={() => togglePref(item.key)}
                    />
                  </label>
                ))}
              </div>

              <div className="flex justify-end">
                <GButton
                  leftIcon={prefSaving ? <GSpinner size="sm" /> : <GIcon icon={Save} size="sm" color="inherit" className="text-on-primary" />}
                  onClick={handleSavePreferences}
                  disabled={prefSaving}
                >
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
