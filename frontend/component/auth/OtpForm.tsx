"use client";

import { useEffect, useRef, useState } from "react";

import { GButton } from "@/component/common/GButton";
import { GAlert } from "@/component/common/GAlert";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { useTranslation } from "@/hooks/useSetting";
import { emailVerificationService } from "@/services/def/EmailVerificationService";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";

import { en } from "../i18n/Otp/en.i18n";
import { ar } from "../i18n/Otp/ar.i18n";
import { fr } from "../i18n/Otp/fr.i18n";

import type { ClipboardEvent, KeyboardEvent } from "react";
import type { TOtpTranslation } from "../i18n/Otp/en.i18n";
import type { TNullable } from "@/domain/type/TCommon";
import type { IOtpFormProps } from "./def/OtpForm";

function OtpForm({ email, onSuccess, onResend, validateOnly = false }: IOtpFormProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState({ verify: false, resend: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const t = useTranslation<TOtpTranslation>({ en, ar, fr });
  const resolveError = useErrorMessage();
  const inputsRef = useRef<TNullable<HTMLInputElement>[]>([]);

  const setDigit = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextCode = [...code];
    nextCode[index] = value.slice(-1);
    setCode(nextCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    if (value && nextCode.every((d) => d !== "")) {
      const fullOtp = nextCode.join("");
      if (fullOtp.length === 6) {
        setTimeout(() => {
          void verifyWithCode(fullOtp);
        }, 50);
      }
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        const nextCode = [...code];
        nextCode[index - 1] = "";
        setCode(nextCode);
        inputsRef.current[index - 1]?.focus();
      } else {
        const nextCode = [...code];
        nextCode[index] = "";
        setCode(nextCode);
      }
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setCode(digits);
    inputsRef.current[5]?.focus();
    setTimeout(() => {
      void verifyWithCode(pastedData);
    }, 50);
  };

  const verifyWithCode = async (otpValue?: string) => {
    const otp = otpValue ?? code.join("");

    if (otp.length !== 6) {
      setError(t.enterFullCode);
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, verify: true }));
      setError("");
      if (!validateOnly) {
        await emailVerificationService.verifyOtp({ email, otp });
      }
      onSuccess(otp);
    } catch (e: unknown) {
      setError(resolveError(toErrorCode(e), t.invalidCode));
    } finally {
      setLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  const verify = async () => {
    await verifyWithCode();
  };

  const resend = async () => {
    if (!email || loading.resend || cooldown > 0) return;
    try {
      setLoading((prev) => ({ ...prev, resend: true }));
      setError("");
      setSuccess("");
      if (onResend) {
        await onResend();
      } else {
        await emailVerificationService.sendOtp({ email });
      }
      setSuccess(t.codeSent);
      setCooldown(60);
    } catch (e: unknown) {
      setError(resolveError(toErrorCode(e), t.resendCodeFailed));
    } finally {
      setLoading((prev) => ({ ...prev, resend: false }));
    }
  };

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void verify();
      }}
      className="w-full max-w-sm mx-auto space-y-5">
      <div className="flex gap-2 justify-center dir-ltr" dir="ltr">
        {code.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={digit}
            maxLength={1}
            autoFocus={i === 0}
            aria-label={t.digitLabel(i + 1)}
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center font-bold text-lg border-2 border-text-muted/40 rounded-xl bg-surface text-text placeholder:text-transparent focus:border-primary caret-primary"
          />
        ))}
      </div>

      {error && <GAlert severity={AccentColorEnum.Danger}>{error}</GAlert>}
      {success && <GAlert severity={AccentColorEnum.Success}>{success}</GAlert>}

      <div className="space-y-2 pt-1">
        <GButton type="submit" loading={loading.verify} className="w-full">
          {t.verify}
        </GButton>

        <GButton
          type="button"
          variant={ButtonVariantEnum.Subtle}
          disabled={loading.verify || loading.resend || cooldown > 0}
          onClick={resend}
          loading={loading.resend}
          className="w-full">
          {cooldown > 0 ? `${t.resendCode} (${cooldown}s)` : t.resendCode}
        </GButton>
      </div>
    </form>
  );
}

export { OtpForm };
