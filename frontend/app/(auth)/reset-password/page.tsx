"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthLayout } from "../layout";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { OtpForm } from "@/component/auth/OtpForm";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TResetPasswordTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { passwordValidator } from "@/lib/utils";
import { authService } from "@/services/def/AuthService";
import { useErrorMessage, toErrorCode } from "@/hooks/useErrorMessage";
import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ResetPasswordStepEnum } from "@/domain/enum/ResetPasswordStepEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

function ResetPasswordPage() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
    fr: { ...fr, ...FrTextField },
  }) as TResetPasswordTranslation & GTextFieldTranslation;

  const resolveError = useErrorMessage();

  const email = useSearchParams().get("email");

  const [step, setStep] = useState<ResetPasswordStepEnum>(ResetPasswordStepEnum.Otp);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ newPassword: "" });
  const [apiError, setApiError] = useState("");
  if (!email) {
    if (typeof window !== "undefined") {
      void import("next/navigation").then(({ redirect }) => {
        try {
          redirect("/forgot-password");
        } catch {}
      });
    }
    return null;
  }

  const validate = (value: string) => ({
    newPassword: passwordValidator(t)(value) || "",
  });

  const handlePasswordChange = (value: string) => {
    setNewPassword(value);
    setErrors((prev) => ({ ...prev, newPassword: "" }));
  };

  const reset = async () => {
    const nextErrors = validate(newPassword);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || !otp || loading) return;

    try {
      setLoading(true);
      setApiError("");
      await authService.resetPassword({ email, otp, newPassword });
      router.replace("/login");
    } catch (e: unknown) {
      setApiError(resolveError(toErrorCode(e), t.passwordResetError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {step === ResetPasswordStepEnum.Otp && (
        <OtpForm
          email={email}
          onSuccess={(resolvedOtp) => {
            setOtp(resolvedOtp);
            setStep(ResetPasswordStepEnum.Reset);
          }}
        />
      )}

      {step === ResetPasswordStepEnum.Reset && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void reset();
          }}
          className="w-full space-y-5">
          {apiError && (
            <div role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {apiError}
            </div>
          )}
          <GTextField
            label={t.newPassword}
            placeholder={t.placeholder.newPassword}
            type="password"
            value={newPassword}
            required
            error={errors.newPassword}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="w-full"
          />
          <GButton type="submit" loading={loading} loadingText={t.resetPassword} fullWidth>
            {t.resetPassword}
          </GButton>
          <div className="pt-2 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary">
              <GIcon icon={ArrowLeft} size={SizeEnum.sm} flip />
              {t.backToLogin}
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}

export default ResetPasswordPage;
