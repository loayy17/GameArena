"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "@/component/auth/AuthLayout";
import TTextField from "@/component/common/TTextField";
import TButton from "@/component/common/TButton";
import { authFlow } from "@/lib/authflow";
import en, { TForgotPasswordTranslation } from "./i18n/en.i18n";
import ar from "./i18n/ar.i18n";
import { default as EnTextField } from "@/component/i18n/TTextField/en.i18n";
import { default as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import { emailValidator } from "@/utils";
import { authApi } from "@/lib/auth.api";
import { AuthFlowAnimationEnum } from "@/types";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TForgotPasswordTranslation;
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
    if (Object.values(nextErrors).some((error) => error)) return;
    await authApi.forgotPassword(email);
    authFlow.set({ email });
    router.push("/reset-password");
  };

  return (
    <AuthLayout page={AuthFlowAnimationEnum.RESET_PASSWORD}>
      <TTextField
        label={t.email}
        value={email}
        type="email"
        required
        error={errors.email}
        onChange={handleChange}
      />
      <br />
      <TButton title={t.sendCode} loading={false} onClick={send} />
    </AuthLayout>
  );
}
