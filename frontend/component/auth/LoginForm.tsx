"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { GButton } from "@/component/common/GButton";
import { GAlert } from "@/component/common/GAlert";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { en } from "@/app/(auth)/login/i18n/en.i18n";
import { ar } from "@/app/(auth)/login/i18n/ar.i18n";
import { fr } from "@/app/(auth)/login/i18n/fr.i18n";
import { emailValidator, passwordValidator } from "@/lib/utils";
import { useAuth } from "@/app/providers/AuthProvider";
import { authService } from "@/services/def/AuthService";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { LoginFieldEnum } from "@/domain/enum/LoginFieldEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { PasswordField } from "./PasswordField";
import { AuthFrame } from "./AuthFrame";
import { GTextField } from "../common/GTextField";

import type { SubmitEvent } from "react";
import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import type { TLoginTranslation } from "@/app/(auth)/login/i18n/en.i18n";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslation<TLoginTranslation & GTextFieldTranslation>({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
    fr: { ...fr, ...FrTextField },
  });

  const { refreshUser } = useAuth();
  const resolveError = useErrorMessage();
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({
    link: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validate = (emailVal: string, passwordVal: string) => {
    return {
      email: emailValidator(t)(emailVal) || "",
      password: passwordValidator(t)(passwordVal) || "",
    };
  };

  const handleChange = (field: LoginFieldEnum, value: string) => {
    if (field === LoginFieldEnum.Email) setEmail(value);
    if (field === LoginFieldEnum.Password) setPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);

    if (Object.values(nextErrors).some((error) => error)) return;

    try {
      setLoading(true);
      setApiError({ link: "", message: "" });
      await authService.login({ email, password });
      const currentUser = await refreshUser();

      if (currentUser) {
        router.replace("/home");
      }
    } catch (e: unknown) {
      const code = toErrorCode(e);
      const errorMessage = resolveError(code);

      if (code === ErrorCodeEnum.EmailNotVerified) {
        setApiError({
          link: "/email-verify?email=" + encodeURIComponent(email),
          message: errorMessage,
        });
      } else {
        setApiError({
          link: "",
          message: errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <AuthFrame icon={LogIn} title={t.login} description={t.loginDescription}>
      <form onSubmit={submit} className="space-y-5">
        {apiError.message && (
          <GAlert severity={AccentColorEnum.Danger}>
            <p className="font-medium">{apiError.message}</p>
            {apiError.link && (
              <Link
                href={apiError.link}
                className="mt-1 inline-block font-semibold text-primary hover:text-primary-hover underline underline-offset-2">
                {t.verifyEmail}
              </Link>
            )}
          </GAlert>
        )}
        <div className="space-y-4">
          <GTextField
            label={t.email}
            placeholder={t.placeholder.email}
            value={email}
            error={errors.email}
            type="email"
            autoComplete="email"
            required
            onChange={(e) => handleChange(LoginFieldEnum.Email, e.target.value)}
          />
          <PasswordField
            label={t.password}
            placeholder={t.placeholder.password}
            value={password}
            error={errors.password}
            autoComplete="current-password"
            required
            onChange={(e) => handleChange(LoginFieldEnum.Password, e.target.value)}
          />
          <GButton type="submit" loading={loading} className="w-full">
            {t.login}
          </GButton>
        </div>
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm pt-4 border-t border-border/40">
          <Link href="/forgot-password" className="text-primary hover:text-primary-hover font-medium">
            {t.forgotPassword}
          </Link>
          <div className="text-text-secondary">
            {t.dontHaveAccount}
            <Link href="/register" className="text-primary hover:text-primary-hover font-semibold px-1">
              {t.register}
            </Link>
          </div>
        </div>
      </form>
      </AuthFrame>
    </div>
  );
}

export { LoginForm };
