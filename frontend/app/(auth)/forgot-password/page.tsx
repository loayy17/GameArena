"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, KeyRound } from "lucide-react";
import { AuthLayout } from "../layout";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { en, type TForgotPasswordTranslation } from "./i18n/en.i18n";
import { ar } from "./i18n/ar.i18n";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { emailValidator } from "@/utils";
import { authService } from "@/services/def/AuthService";
import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";

function ForgotPasswordPage() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TForgotPasswordTranslation & GTextFieldTranslation;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });
  const [apiError, setApiError] = useState("");

  const validate = (value: string) => ({
    email: emailValidator(t)(value) || "",
  });

  const handleChange = (value: string) => {
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const send = async () => {
    const nextErrors = validate(email);
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean) || loading) return;

    try {
      setLoading(true);
      setApiError("");
      await authService.forgotPassword({ email });
      router.push("/reset-password?email=" + encodeURIComponent(email));
    } catch {
      setApiError(t.sendError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <GIcon icon={KeyRound} size="xl" tile tileSize="xl" tileGradient="bg-primary" tileColor="on-primary" />
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-text tracking-tight">{t.forgotPassword}</h1>
            <p className="text-sm text-text-muted mt-0.5">{t.description}</p>
          </div>
        </div>
        <div className="space-y-5">
          {apiError && (
            <div role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {apiError}
            </div>
          )}
          <GTextField
            label={t.email}
            placeholder={t.placeholder.email}
            value={email}
            type="email"
            required
            error={errors.email}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full"
          />
          <GButton loading={loading} onClick={send} fullWidth>
            {t.sendCode}
          </GButton>
          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
              <GIcon icon={ArrowLeft} size="sm" color="inherit" className="rtl:-scale-x-100" />
              {t.backToLogin}
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
