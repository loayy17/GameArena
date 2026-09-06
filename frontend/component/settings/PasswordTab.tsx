"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { GButton } from "@/component/common/GButton";
import { PasswordField } from "@/component/auth/PasswordField";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { userService } from "@/services/def/UserService";
import { passwordValidator } from "@/lib/utils";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

import type { IPasswordTabProps } from "./def/SettingsTabs";

export function PasswordTab({ showMessage, t }: IPasswordTabProps) {
  const resolveError = useErrorMessage();
  const [saving, setSaving] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!oldPassword.trim()) errs.oldPassword = t.dynamicFieldRequired(t.settings.password.oldPassword);
    const pwErr = passwordValidator(t)(newPassword);
    if (pwErr) errs.newPassword = pwErr;
    if (!confirmPassword.trim()) errs.confirmPassword = t.dynamicFieldRequired(t.settings.password.confirmPassword);
    else if (newPassword !== confirmPassword) errs.confirmPassword = t.invalidConfirmPassword;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await userService.changePassword({ oldPassword, newPassword });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      showMessage(t.settings.password.saved, "success");
    } catch (e: unknown) {
      const code = toErrorCode(e);
      if (code === ErrorCodeEnum.InvalidCredentials) setErrors({ oldPassword: t.settings.password.invalidCurrentPassword });
      else showMessage(resolveError(code, t.settings.password.saveFailed), "danger");
    }
    setSaving(false);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void handleSave();
      }}
      className="space-y-4">
      <PasswordField
        label={t.settings.password.oldPassword}
        value={oldPassword}
        error={errors.oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <PasswordField
        label={t.settings.password.newPassword}
        value={newPassword}
        error={errors.newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <PasswordField
        label={t.settings.password.confirmPassword}
        value={confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="flex justify-end">
        <GButton type="submit" loading={saving} startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}>
          {t.settings.password.save}
        </GButton>
      </div>
    </form>
  );
}
