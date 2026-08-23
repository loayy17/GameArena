"use client";

import { useRef, useState } from "react";
import { Camera, Save, Trash2 } from "lucide-react";
import { GAvatar } from "@/component/common/GAvatar";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GTextField } from "@/component/common/GTextField";
import { GIcon } from "@/component/common/GIcon";
import { GAsync } from "@/component/common/GAsync";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { useAuth } from "@/app/providers/AuthProvider";
import { useErrorMessage, toErrorCode } from "@/hooks/useErrorMessage";
import { userService } from "@/services/def/UserService";
import type { TNullable } from "@/domain/type/TCommon";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export function ProfileTab({
  user,
  showMessage,
  t,
}: {
  user: NonNullable<ReturnType<typeof useAuth>["user"]>;
  showMessage: (msg: string) => void;
  t: any;
}) {
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
      showMessage(t.settings.profile.saved);
    } catch (e: unknown) {
      showMessage(resolveError(toErrorCode(e), t.settings.profile.saveFailed));
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
      showMessage(t.settings.profile.avatarSaved);
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
      showMessage(t.settings.profile.avatarRemoved);
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
            <GAvatar firstName={user?.firstName} lastName={user?.lastName} avatarUrl={user?.avatarUrl} status={user?.status} size={SizeEnum.xl} />
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
              <GButtonAsync
                type="button"
                variant={ButtonVariantEnum.Secondary}
                rounded={SizeEnum.sm}
                busy={avatarUploading}
                loadingText={t.settings.profile.avatarUploading}
                startIcon={<GIcon icon={Camera} size={SizeEnum.sm} />}
                onClick={() => avatarInputRef.current?.click()}>
                {t.settings.profile.avatarUpload}
              </GButtonAsync>
              {user?.avatarUrl && (
                <GButtonAsync
                  type="button"
                  variant={ButtonVariantEnum.Secondary}
                  rounded={SizeEnum.sm}
                  disabled={avatarUploading}
                  startIcon={<GIcon icon={Trash2} size={SizeEnum.sm} />}
                  onClick={() => handleAvatarRemove()}>
                  {t.settings.profile.avatarRemove}
                </GButtonAsync>
              )}
              {avatarError && (
                <p className="text-xs text-danger" role="alert">
                  {avatarError}
                </p>
              )}
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
            <GButtonAsync
              type="submit"
              busy={saving}
              disabled={!isDirty}
              loadingText={t.settings.profile.save}
              startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}>
              {t.settings.profile.save}
            </GButtonAsync>
          </div>
        </>
      </GAsync>
    </form>
  );
}
