"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { KeyRound } from "lucide-react";

import { AuthFrame } from "@/component/auth/AuthFrame";
import { GTextField } from "@/component/common/GTextField";
import { GAlert } from "@/component/common/GAlert";
import { GButton } from "@/component/common/GButton";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { useAuthAction } from "@/hooks/useAuthAction";
import { emailValidator } from "@/lib/utils";
import { authService } from "@/services/def/AuthService";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { en } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { fr } from "./i18n/fr.i18n";

import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import type { TForgotPasswordTranslation } from "./i18n/en.i18n";

function ForgotPasswordPage() {
  const router = useRouter();
  const t = useTranslation<TForgotPasswordTranslation & GTextFieldTranslation>({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
    fr: { ...fr, ...FrTextField },
  });
  const { loading, apiError, run } = useAuthAction();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const send = async () => {
    const error = emailValidator(t)(email);
    setEmailError(error || "");
    if (error) return;

    await run(async () => {
      await authService.forgotPassword({ email });
      router.push("/reset-password?email=" + encodeURIComponent(email));
    }, t.sendError);
  };

  return (
    <AuthFrame icon={KeyRound} title={t.forgotPassword} description={t.description} backLabel={t.backToLogin}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
        className="space-y-5">
        {apiError && <GAlert severity={AccentColorEnum.Danger}>{apiError}</GAlert>}
        <GTextField
          label={t.email}
          placeholder={t.placeholder.email}
          value={email}
          error={emailError}
          type="email"
          autoComplete="email"
          required
          className="w-full"
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />
        <GButton type="submit" loading={loading} className="w-full">
          {t.sendCode}
        </GButton>
      </form>
    </AuthFrame>
  );
}

export default ForgotPasswordPage;
