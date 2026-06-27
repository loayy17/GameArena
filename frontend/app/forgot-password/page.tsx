"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/component/auth/AuthLayout";
import { TTextField } from "@/component/common/TTextField";
import { TButton } from "@/component/common/TButton";
import { authFlow } from "@/repositories/proxy/authflow";
import { en, type TForgotPasswordTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { en as EnTextField } from "@/component/i18n/TTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import { emailValidator } from "@/utils";
import { AuthFlowAnimationEnum } from "@/types";
import { authService } from "@/services/def/AuthService";
import type { TTextFieldTranslation } from "@/component/i18n/TTextField/en.i18n";

function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TForgotPasswordTranslation & TTextFieldTranslation;

  const [errors, setErrors] = useState({
    email: "",
  });

  const validate = (emailVal: string) => {
    return {
      email: emailValidator(t)(emailVal) || "",
    };
  };

  const handleChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const send = async () => {
    const nextErrors = validate(email);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some((error) => error) || loading) return;

    try {
      setLoading(true);
      await authService.forgotPassword({ email });
      authFlow.set({ email });
      router.push("/reset-password");
    } catch (error) {
      console.error("Forgot password request failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout page={AuthFlowAnimationEnum.RESET_PASSWORD}>
      <div className="w-full space-y-5">
        <TTextField
          label={t.email}
          placeholder={t.placeholder.email}
          value={email}
          type="email"
          required
          error={errors.email}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full"
        />
        <TButton loading={loading} onClick={send} className="w-full shadow-md">
          {t.sendCode}
        </TButton>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
