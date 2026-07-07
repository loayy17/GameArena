"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/app/(auth)/layout";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { OtpForm } from "@/component/auth/OtpForm";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TResetPasswordTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { passwordValidator } from "@/utils";
import { AuthFlowAnimationEnum } from "@/domain/enum/AuthFlowAnimationEnum";
import { authService } from "@/services/def/AuthService";
import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";

function ResetPasswordPage() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TResetPasswordTranslation & GTextFieldTranslation;

  const email = useSearchParams().get("email");

  const [step, setStep] = useState<"otp" | "reset">("otp");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ newPassword: "" });
  if (!email) {
    if (typeof window !== "undefined") {
      void import("next/navigation").then(({ redirect }) => {
        try {
          redirect("/forgot-password");
        } catch {
          console.error(
            "Redirect failed. Please navigate to /forgot-password manually.",
          );
        }
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
      await authService.resetPassword({ email, otp, newPassword });
      router.replace("/login");
    } catch (error) {
      console.error("Reset password failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      page={
        step === "otp"
          ? AuthFlowAnimationEnum.VERIFY_OTP
          : AuthFlowAnimationEnum.SET_PASSWORD
      }
    >
      {step === "otp" && (
        <OtpForm
          email={email}
          onSuccess={(resolvedOtp) => {
            setOtp(resolvedOtp);
            setStep("reset");
          }}
        />
      )}

      {step === "reset" && (
        <div className="w-full space-y-5">
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
          <GButton loading={loading} onClick={reset} fullWidth>
            {t.resetPassword}
          </GButton>
        </div>
      )}
    </AuthLayout>
  );
}

export default ResetPasswordPage;
