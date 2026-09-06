"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MailCheck } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { AuthFrame } from "@/component/auth/AuthFrame";
import { OtpForm } from "@/component/auth/OtpForm";
import { GTextField } from "@/component/common/GTextField";
import { GAlert } from "@/component/common/GAlert";
import { GButton } from "@/component/common/GButton";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { useAuthAction } from "@/hooks/useAuthAction";
import { emailValidator } from "@/lib/utils";
import { emailVerificationService } from "@/services/def/EmailVerificationService";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { en as enEmailVerify } from "./i18n/en.i18n";
import { ar as arEmailVerify } from "./i18n/ar.i18n";
import { fr as frEmailVerify } from "./i18n/fr.i18n";

import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import type { TEmailVerifyTranslation } from "./i18n/en.i18n";

function EmailVerifyPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const emailParam = useSearchParams().get("email");

  const t = useTranslation<TEmailVerifyTranslation & GTextFieldTranslation>({
    en: { ...enEmailVerify, ...EnTextField },
    ar: { ...arEmailVerify, ...ArTextField },
    fr: { ...frEmailVerify, ...FrTextField },
  });
  const { loading, apiError, run } = useAuthAction();

  const [email, setEmail] = useState(emailParam || "");
  const [step, setStep] = useState(emailParam ? "otp" : "email");
  const [emailError, setEmailError] = useState("");

  const sendCode = async () => {
    const error = emailValidator(t)(email);
    setEmailError(error || "");
    if (error) return;

    await run(async () => {
      await emailVerificationService.sendOtp({ email });
      setStep("otp");
    }, t.errorSendFailed);
  };

  const handleOtpSuccess = async () => {
    const user = await refreshUser();
    router.replace(user ? "/home" : "/login");
  };

  if (step === "otp") {
    return (
      <AuthFrame icon={MailCheck} title={t.title} description={t.enterCode} backLabel={t.backToLogin}>
        {apiError && <GAlert severity={AccentColorEnum.Danger}>{apiError}</GAlert>}
        <OtpForm email={email} onSuccess={handleOtpSuccess} />
      </AuthFrame>
    );
  }

  return (
    <AuthFrame icon={MailCheck} title={t.title} description={t.description} backLabel={t.backToLogin}>
      <div className="space-y-5">
        <GTextField
          label={t.emailLabel}
          placeholder={t.enterEmail}
          value={email}
          type="email"
          autoComplete="email"
          required
          error={emailError}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          className="w-full"
        />
        {apiError && <GAlert severity={AccentColorEnum.Danger}>{apiError}</GAlert>}
        <GButton loading={loading} onClick={() => void sendCode()} className="w-full">
          {t.sendCode}
        </GButton>
      </div>
    </AuthFrame>
  );
}

export default EmailVerifyPage;
