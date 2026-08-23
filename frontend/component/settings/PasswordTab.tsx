"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { GButtonAsync } from "@/component/common/GButtonAsync";
import { GTextField } from "@/component/common/GTextField";
import { GIcon } from "@/component/common/GIcon";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { useErrorMessage, toErrorCode } from "@/hooks/useErrorMessage";
import { userService } from "@/services/def/UserService";
import { passwordValidator } from "@/lib/utils";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";

export function PasswordTab({ showMessage, t }: { showMessage: (msg: string) => void; t: any }) {
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
      showMessage(t.settings.password.saved);
    } catch (e: unknown) {
      const code = toErrorCode(e);
      if (code === ErrorCodeEnum.InvalidCredentials) setErrors({ oldPassword: t.settings.password.invalidCurrentPassword });
      else showMessage(resolveError(code, t.settings.password.saveFailed));
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
      <GTextField
        label={t.settings.password.oldPassword}
        type="password"
        value={oldPassword}
        error={errors.oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <GTextField
        label={t.settings.password.newPassword}
        type="password"
        value={newPassword}
        error={errors.newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <GTextField
        label={t.settings.password.confirmPassword}
        type="password"
        value={confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="flex justify-end">
        <GButtonAsync type="submit" busy={saving} loadingText={t.settings.password.save} startIcon={<GIcon icon={Save} size={SizeEnum.sm} />}>
          {t.settings.password.save}
        </GButtonAsync>
      </div>
    </form>
  );
}
