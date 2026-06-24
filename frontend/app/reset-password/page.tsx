"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/component/auth/AuthLayout";
import TTextField from "@/component/common/TTextField";
import TButton from "@/component/common/TButton";
import OtpForm from "@/component/auth/OtpForm";
import { authFlow } from "@/lib/authflow";
import { authApi } from "@/lib/auth.api";
import { useTranslation } from "@/Hooks/useTranslation";
import en, { TResetPasswordTranslation } from "./i18n/en.i18n";
import ar from "./i18n/ar.i18n";
import { default as EnTextField } from "@/component/i18n/TTextField/en.i18n";
import { default as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { passwordValidator } from "@/utils";
import { AuthFlowAnimationEnum } from "@/types";
export default function Page() {
  const router = useRouter();
  const flow = authFlow.get();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TResetPasswordTranslation;
  const [step, setStep] = useState<"otp" | "reset">("otp");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: "",
  });
  const email = flow.email;
  const validate = (newPasswordVal: string) => {
    return {
      newPassword: passwordValidator(t)(newPasswordVal) || "",
    };
  };
  const handleChange = (value: string) => {
    setNewPassword(value);
    setErrors((prev) => ({ ...prev, newPassword: "" }));
  };
  const reset = async () => {
    try {
      setLoading(true);
      const nextErrors = validate(newPassword);
      console.log("email", email, "otp", otp, "newPassword", newPassword);
      setErrors(nextErrors);
      if (!email || !otp || Object.values(nextErrors).some((error) => error))
        return;

      await authApi.resetPassword({ email, otp, newPassword });

      authFlow.clear();
      router.replace("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!email) return null;

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
          onSuccess={(otp) => {
            setOtp(otp);
            setStep("reset");
          }}
        />
      )}

      {step === "reset" && (
        <>
          <TTextField
            label={t.newPassword}
            type="password"
            value={newPassword}
            required
            error={errors.newPassword}
            onChange={handleChange}
          />
          <br />
          <TButton title={t.resetPassword} onClick={reset} />
        </>
      )}
    </AuthLayout>
  );
}
