"use client";

import {
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { GButton } from "@/component/common/GButton";
import { en, type TOtpTranslation } from "../i18n/Otp/en.i18n";
import { ar } from "../i18n/Otp/ar.i18n";
import { useTranslation } from "@/hooks/useSetting";
import type { TNullable } from "@/domain/type/TCommon";
import type { OtpFormProps } from "./def/OtpForm";
import { emailVerificationService } from "@/services/def/EmailVerificationService";

function OtpForm({ email, onSuccess }: OtpFormProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState({ verify: false, resend: false });
  const [error, setError] = useState("");
  const t = useTranslation({ en, ar }) as TOtpTranslation;
  const inputsRef = useRef<TNullable<HTMLInputElement>[]>([]);

  const setDigit = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const nextCode = [...code];
    nextCode[index] = value.slice(-1);
    setCode(nextCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
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
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return;

    const digits = pastedData.split("");
    setCode(digits);
    inputsRef.current[5]?.focus();
  };

  const verify = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      setError(t.enterFullCode);
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, verify: true }));
      setError("");
      await emailVerificationService.verifyOtp({ email, otp });
      onSuccess(otp);
    } catch {
      setError(t.invalidCode);
    } finally {
      setLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  const resend = async () => {
    if (!email || loading.resend) return;
    try {
      setLoading((prev) => ({ ...prev, resend: true }));
      setError("");
      await emailVerificationService.sendOtp({ email });
    } catch {
      setError(t.resendCodeFailed);
    } finally {
      setLoading((prev) => ({ ...prev, resend: false }));
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">
      {/* Input Array Blocks Container */}
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
            onChange={(e) => setDigit(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center font-bold text-lg border border-border rounded-xl bg-surface/40 text-text focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        ))}
      </div>

      {/* Semantic Error Output Box */}
      {error && (
        <p role="alert" className="text-error text-xs font-medium text-center">
          {error}
        </p>
      )}

      <div className="space-y-2 pt-1">
        <GButton
          loading={loading.verify}
          onClick={verify}
          className="w-full"
        >
          {t.verify}
        </GButton>

        <GButton
          type="button"
          disabled={loading.verify || loading.resend}
          onClick={resend}
          className="w-full"
        >
          {t.resendCode}
        </GButton>
      </div>
    </div>
  );
}

export { OtpForm };
