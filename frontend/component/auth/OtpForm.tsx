"use client";

import { useRef, useState } from "react";
import { TButton } from "@/component/common/TButton";
import { emailVerficationService } from "@/services/def/EmailVerficationService";
import { en, type TOtpTranslation } from "../i18n/Otp/en.i18n";
import { ar } from "../i18n/Otp/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import type { IOtpFormProps } from "./def/OtpForm";

function OtpForm({ email, onSuccess }: IOtpFormProps) {
  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState({ verify: false, resend: false });
  const [error, setError] = useState("");
  const t = useTranslation({ en, ar }) as TOtpTranslation;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...code];
    next[i] = value.slice(-1);
    setCode(next);

    if (value && i < 5) inputsRef.current[i + 1]?.focus();
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
      await emailVerficationService.verifyOtp({ email, otp });
      onSuccess(otp);
    } catch {
      setError(t.invalidCode);
    } finally {
      setLoading((prev) => ({ ...prev, verify: false }));
    }
  };

  const resend = async () => {
    if (!email) return;
    try {
      setLoading((prev) => ({ ...prev, resend: true }));
      setError("");
      await emailVerficationService.sendOtp({ email });
    } catch {
      setError(t.resendCodeFailed);
    } finally {
      setLoading((prev) => ({ ...prev, resend: false }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-center">
        {code.map((c, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={c}
            maxLength={1}
            onChange={(e) => setDigit(i, e.target.value)}
            className="w-12 h-12 text-center border rounded-lg"
          />
        ))}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <TButton title={t.verify} loading={loading.verify} onClick={verify} />
      <TButton title={t.resendCode} loading={loading.resend} onClick={resend} />
    </div>
  );
}

export { OtpForm };
