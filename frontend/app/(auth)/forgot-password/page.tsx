"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/app/(auth)/layout";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { en, type TForgotPasswordTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { emailValidator } from "@/utils";
import { AuthFlowAnimationEnum } from "@/domain/enum/AuthFlowAnimationEnum";
import { authService } from "@/services/def/AuthService";
import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";

function ForgotPasswordPage() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TForgotPasswordTranslation & GTextFieldTranslation;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });

  const validate = (value: string) => ({
    email: emailValidator(t)(value) || "",
  });

  const handleChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const send = async () => {
    const nextErrors = validate(email);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || loading) return;

    try {
      setLoading(true);
      await authService.forgotPassword({ email });
      router.push("/reset-password?email=" + encodeURIComponent(email));
    } catch (error) {
      console.error("Forgot password request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout page={AuthFlowAnimationEnum.RESET_PASSWORD}>
      <div className="w-full space-y-5">
        <GTextField
          label={t.email}
          placeholder={t.placeholder.email}
          value={email}
          type="email"
          required
          error={errors.email}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full"
        />
        <GButton loading={loading} onClick={send} fullWidth>
          {t.sendCode}
        </GButton>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
