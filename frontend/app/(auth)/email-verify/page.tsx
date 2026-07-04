"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthLayout } from "@/app/(auth)/layout";
import { OtpForm } from "@/component/auth/OtpForm";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { AuthFlowAnimationEnum } from "@/domain/enum/AuthFlowAnimationEnum";
import { emailVerificationService } from "@/services/def/EmailVerificationService";
import { emailValidator } from "@/utils";
import { en as EnTextField, type GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { useTranslation } from "@/hooks/useSetting";

const en = {
  title: "Verify Email",
  description: "Enter your email to receive a verification code",
  sendCode: "Send Code",
  sending: "Sending...",
  enterEmail: "Enter your email",
  enterCode: "Enter the verification code sent to your email",
  errorSendFailed: "Failed to send verification code. Please try again.",
};
type TEmailVerifyTranslation = typeof en;

const ar = {
  title: "تأكيد البريد الإلكتروني",
  description: "أدخل بريدك الإلكتروني لاستلام رمز التحقق",
  sendCode: "إرسال الرمز",
  sending: "جارٍ الإرسال...",
  enterEmail: "أدخل بريدك الإلكتروني",
  enterCode: "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني",
  errorSendFailed: "فشل إرسال رمز التحقق. حاول مرة أخرى",
};

function EmailVerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email");

  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TEmailVerifyTranslation & GTextFieldTranslation;

  const [email, setEmail] = useState(emailParam || "");
  const [step, setStep] = useState(emailParam ? "otp" : "email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const sendCode = async () => {
    const err = emailValidator(t)(email);
    setEmailError(err || "");
    if (err || loading) return;

    try {
      setLoading(true);
      setError("");
      await emailVerificationService.sendOtp({ email });
      setStep("otp");
    } catch {
      setError(t.errorSendFailed);
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <AuthLayout page={AuthFlowAnimationEnum.VERIFY_OTP}>
        <div className="w-full space-y-4">
          <p className="text-sm text-text-secondary text-center">{t.enterCode}</p>
          {error && (
            <p className="text-error text-xs text-center">{error}</p>
          )}
          <OtpForm email={email} onSuccess={() => router.replace("/home")} />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout page={AuthFlowAnimationEnum.VERIFY_OTP}>
      <div className="w-full space-y-5">
        <p className="text-sm text-text-secondary">{t.description}</p>
        <GTextField
          label={t.enterEmail}
          placeholder={t.enterEmail}
          value={email}
          type="email"
          required
          error={emailError}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          className="w-full"
        />
        {error && (
          <p className="text-error text-xs">{error}</p>
        )}
        <GButton loading={loading} onClick={sendCode} className="w-full shadow-md">
          {loading ? t.sending : t.sendCode}
        </GButton>
      </div>
    </AuthLayout>
  );
}

export default EmailVerifyPage;
