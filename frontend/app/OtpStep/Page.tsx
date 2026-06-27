"use client";

import { useRef, useState } from "react";
import { api } from "@/app/network";
import { useRouter } from "next/router";
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
  endpoint,
  resendEndpoint,
  onSuccess,
}: TOtpStepProps) {
  const [code, setCode] = useState(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = useTranslation({
    en,
    ar,
  }) as TOtpStepTranslation;
  const router = useRouter();
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  if (email) router.push("/home");
  const setDigit = (i: number, v: string) => {
    if (!/^\d*$/.test(v)) return;

    const next = [...code];
    next[i] = v.slice(-1);
    setCode(next);

    if (v && i < 5) inputsRef.current[i + 1]?.focus();
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
    if (!resendEndpoint) return;
    await api.post(resendEndpoint, { email });
  };

  return (
    <div>
      <div className="flex gap-2 justify-center mb-4">
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

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <TButton
        title={loading ? t.loadingEllipse : t.verify}
        loading={loading}
        onClick={verify}
      />

      <TButton
        title={loading ? t.loadingEllipse : t.resendCode}
        loading={loading}
        onClick={resend}
      />
    </div>
  );
}

export default OtpStep;
