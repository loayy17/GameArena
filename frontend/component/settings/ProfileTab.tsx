"use client";

import { useRef, useState } from "react";
import { Camera, Save, Trash2 } from "lucide-react";

import { GAvatar } from "@/component/common/GAvatar";
import { GButton } from "@/component/common/GButton";
import { GAlert } from "@/component/common/GAlert";
import { GTextField } from "@/component/common/GTextField";
import { GIcon } from "@/component/common/GIcon";
import { GAsync } from "@/component/common/GAsync";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { useAuth } from "@/app/providers/AuthProvider";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { userService } from "@/services/def/UserService";

import type { TNullable } from "@/domain/type/TCommon";
import type { IProfileTabProps } from "./def/SettingsTabs";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export function ProfileTab({ user, showMessage, t }: IProfileTabProps) {
  const resolveError = useErrorMessage();
  const { refreshUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<TNullable<string>>(null);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");
  const [userName, setUserName] = useState(user.userName ?? "");
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  const isDirty = firstName !== (user.firstName ?? "") || lastName !== (user.lastName ?? "") || userName !== (user.userName ?? "");

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = t.dynamicFieldRequired(t.settings.profile.firstName);
    if (!lastName.trim()) errs.lastName = t.dynamicFieldRequired(t.settings.profile.lastName);
    if (!userName.trim()) errs.userName = t.dynamicFieldRequired(t.settings.profile.username);
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(userName.trim())) errs.userName = t.settings.profile.invalidUsername;
    setProfileErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await userService.updateProfile({ firstName, lastName, userName, email: user.email, password: null });
      await refreshUser();
      showMessage(t.settings.profile.saved, "success");
    } catch (e: unknown) {
      showMessage(resolveError(toErrorCode(e), t.settings.profile.saveFailed), "danger");
    }
    setSaving(false);
  };

  const handleAvatarChange = async (file?: File) => {
    if (!file) return;
    setAvatarError(null);
    if (file.size > MAX_AVATAR_BYTES) return setAvatarError(t.settings.profile.avatarTooLarge);
    if (!ALLOWED_AVATAR_TYPES.includes(file.type)) return setAvatarError(t.settings.profile.avatarInvalidType);
    setAvatarUploading(true);
    try {
      await userService.uploadAvatar(file);
      await refreshUser();
      showMessage(t.settings.profile.avatarSaved, "success");
    } catch (e: unknown) {
      setAvatarError(resolveError(toErrorCode(e), t.settings.profile.avatarSaveFailed));
    }
    setAvatarUploading(false);
  };

  const handleAvatarRemove = async () => {
    setAvatarError(null);
    setAvatarUploading(true);
    try {
      await userService.removeAvatar();
      await refreshUser();
      showMessage(t.settings.profile.avatarRemoved, "success");
    } catch (e: unknown) {
      setAvatarError(resolveError(toErrorCode(e), t.settings.profile.avatarRemoveFailed));
    }
    setAvatarUploading(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSave();
      }}
      className="space-y-4">
      <GAsync loading={!user} spinnerSize={SizeEnum.md} className="py-10">
        <>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <GAvatar user={user ?? {}} size={SizeEnum.xl} />
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                aria-label={t.settings.profile.avatarUpload}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleAvatarChange(file);
                  e.target.value = "";
                }}
              />
              <GButton
                type="button"
                variant={ButtonVariantEnum.Secondary}
                loading={avatarUploading}
                startIcon={<GIcon icon={Camera} size={SizeEnum.sm} className="rounded-md" />}
                onClick={() => avatarInputRef.current?.click()}>
                {t.settings.profile.avatarUpload}
              </GButton>
              {user?.avatarUrl && (
                <GButton
                  type="button"
                  variant={ButtonVariantEnum.Secondary}
                  disabled={avatarUploading}
                  startIcon={<GIcon icon={Trash2} size={SizeEnum.sm} className="rounded-md" />}
                  onClick={() => handleAvatarRemove()}>
                  {t.settings.profile.avatarRemove}
                </GButton>
              )}
              {avatarError && <GAlert severity={AccentColorEnum.Danger}>{avatarError}</GAlert>}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GTextField
              label={t.settings.profile.firstName}
              value={firstName}
              error={profileErrors.firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <GTextField
              label={t.settings.profile.lastName}
              value={lastName}
              error={profileErrors.lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div className="sm:col-span-2">
              <GTextField
                label={t.settings.profile.username}
                value={userName}
                error={profileErrors.userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <GTextField label={t.settings.profile.email} value={user?.email ?? ""} disabled />
            </div>
          </div>
          <div className="flex justify-end">
            <GButton
              type="submit"
              loading={saving}
              disabled={!isDirty}
              startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}>
              {t.settings.profile.save}
            </GButton>
          </div>
        </>
      </GAsync>
    </form>
  );
}