"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, KeyRound } from "lucide-react";

import { AuthFrame } from "@/component/auth/AuthFrame";
import { PasswordField } from "@/component/auth/PasswordField";
import { OtpForm } from "@/component/auth/OtpForm";
import { GAlert } from "@/component/common/GAlert";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { useTranslation } from "@/hooks/useSetting";
import { useAuthAction } from "@/hooks/useAuthAction";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { passwordValidator } from "@/lib/utils";
import { authService } from "@/services/def/AuthService";
import { ResetPasswordStepEnum } from "@/domain/enum/ResetPasswordStepEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { en } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import type { TResetPasswordTranslation } from "./i18n/en.i18n";

function ResetPasswordPage() {
  const router = useRouter();
  const t = useTranslation<TResetPasswordTranslation & GTextFieldTranslation>({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
    fr: { ...fr, ...FrTextField },
  });
  const { loading, apiError, run } = useAuthAction();

  const email = useSearchParams().get("email");

  const [step, setStep] = useState<ResetPasswordStepEnum>(ResetPasswordStepEnum.Otp);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) router.replace("/forgot-password");
  }, [email, router]);

  if (!email) return null;

  if (success) {
    return (
      <div className="w-full space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-success-muted">
            <GIcon icon={CheckCircle} size={SizeEnum.xl} color={AccentColorEnum.Success} />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-text">{t.resetSuccessTitle}</h1>
        <p className="text-sm text-text-muted">{t.resetSuccessDescription}</p>
        <GButton className="w-full" onClick={() => router.replace("/login")}>
          {t.goToLogin}
        </GButton>
      </div>
    );
  }

  const reset = async () => {
    const error = passwordValidator(t)(newPassword);
    setPasswordError(error || "");
    if (error || !otp) return;

    await run(async () => {
      await authService.resetPassword({ email, otp, newPassword });
      setSuccess(true);
    }, t.passwordResetError);
  };

  if (step === ResetPasswordStepEnum.Otp) {
    return (
      <AuthFrame icon={KeyRound} title={t.resetPassword} description={t.otpDescription.replace("{email}", email)} backLabel={t.backToLogin}>
        <OtpForm
          email={email}
          validateOnly
          onResend={() => authService.forgotPassword({ email })}
          onSuccess={(resolvedOtp) => {
            setOtp(resolvedOtp);
            setStep(ResetPasswordStepEnum.Reset);
          }}
        />
      </AuthFrame>
    );
  }

  return (
    <AuthFrame icon={KeyRound} title={t.newPassword} backLabel={t.backToLogin}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void reset();
        }}
        className="space-y-5">
        {apiError && <GAlert severity={AccentColorEnum.Danger}>{apiError}</GAlert>}
        <PasswordField
          label={t.newPassword}
          placeholder={t.placeholder.newPassword}
          value={newPassword}
          error={passwordError}
          hint={t.passwordHint}
          required
          className="w-full"
          onChange={(e) => {
            setNewPassword(e.target.value);
            setPasswordError("");
          }}
        />
        <GButton type="submit" loading={loading} className="w-full">
          {t.resetPassword}
        </GButton>
      </form>
    </AuthFrame>
  );
}

export default ResetPasswordPage;
