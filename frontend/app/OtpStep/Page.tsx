"use client";

import {
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";
import { api } from "@/app/network";
import { TButton } from "@/component/common/TButton";
import { en, type TOtpStepTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";

type TOtpStepProps = {
  email: string;
  title: string;
  subtitle: string;
  endpoint: string;
  resendEndpoint: string;
  onSuccess: () => void;
};

function OtpStep({
  email,
  title,
  subtitle,
  endpoint,
  resendEndpoint,
  onSuccess,
}: TOtpStepProps) {
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslation({ en, ar }) as TOtpStepTranslation;
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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
        // Input is already empty; backward wipe and shift focus
        const nextCode = [...code];
        nextCode[index - 1] = "";
        setCode(nextCode);
        inputsRef.current[index - 1]?.focus();
      } else {
        // Just clear current element
        const nextCode = [...code];
        nextCode[index] = "";
        setCode(nextCode);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pastedData)) return; // Ensure it's exactly 6 digits

    const digits = pastedData.split("");
    setCode(digits);
    inputsRef.current[5]?.focus(); // Move focus safely to the final bucket
  };

  const verify = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      setError("Enter full code");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post(endpoint, {
        email,
        otp,
      });

      onSuccess();
    } catch {
      setError("Invalid code");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!resendEndpoint || loading) return;
    try {
      setError("");
      await api.post(resendEndpoint, { email });
    } catch {
      setError("Failed to resend code");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Header Context Meta */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-text">{title}</h2>
        <p className="text-xs text-text-secondary">
          {subtitle} <span className="font-semibold text-text">{email}</span>
        </p>
      </div>

      {/* 6-Digit Native Block Array */}
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
            className="w-12 h-14 text-center font-bold text-lg border border-border/80 rounded-xl bg-surface/50 text-text focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        ))}
      </div>

      {/* Error Output Indicator */}
      {error && (
        <p className="text-error text-xs font-semibold text-center animate-fade-in">
          {error}
        </p>
      )}

      {/* Submissions Control Set */}
      <div className="space-y-3 pt-2">
        <TButton
          loading={loading}
          onClick={verify}
          className="w-full shadow-lg"
        >
          {loading ? t.loadingEllipse : t.verify}
        </TButton>
        <TButton
          type="button"
          disabled={loading}
          onClick={resend}
          className="w-full shadow-lg"
        >
          {t.resendCode}
        </TButton>
      </div>
    </div>
  );
}

export default OtpStep;
