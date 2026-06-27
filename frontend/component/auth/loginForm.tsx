"use client";

import Link from "next/link";
import { TTextField } from "@/component/common/TTextField";
import { TButton } from "@/component/common/TButton";
import { SubmitEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  en as EnTextField,
  type TTextFieldTranslation,
} from "@/component/i18n/TTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import { en, type TLoginTranslation } from "@/app/login/i18n/en.i18n";
import { ar } from "@/app/login/i18n/ar.i18n";
import { emailValidator, passwordValidator } from "@/utils";
import { useAuth } from "@/app/AuthProvider";
import { authService } from "@/services/def/AuthService";
import { AxiosError } from "axios";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import type { TFieldLogin } from "@/types";

function LoginForm() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TLoginTranslation & TTextFieldTranslation;

  const { refreshUser } = useAuth();
  const [email, setEmail] = useState("");
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

  const handleChange = (field: TFieldLogin, value: string) => {
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
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
      const err = e as AxiosError<IApiResponse<unknown>>;
      const code = err?.response?.data?.errorCode;

      const errorMessage =
        t.loginErrorCodeEnum[code as keyof typeof t.loginErrorCodeEnum] ||
        err?.response?.data?.message ||
        t.unknownError;

      if (code === ErrorCodeEnum.EmailNotVerified) {
        setApiError({
          link: "/email-verify",
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
    <div className="w-full max-w-md p-6 sm:p-8 bg-surface-alt/40 border border-border/60 rounded-lg shadow-md ">
      <form onSubmit={submit} className="space-y-5">
        <div className="space-y-4">
          <TTextField
            label={t.email}
            placeholder={t.placeholder.email}
            value={email}
            type="email"
            required
            error={errors.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
          />

          <TTextField
            label={t.password}
            placeholder={t.placeholder.password}
            value={password}
            type="password"
            required
            error={errors.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
          />

          {/* API Error Callout */}
          {apiError.message && (
            <div className="text-sm p-3 rounded-md bg-error-bg border border-error/20 text-error animate-fade-in flex flex-col gap-1">
              <span>{apiError.message}</span>
              {apiError.link && (
                <Link
                  href={apiError.link}
                  className="text-primary hover:text-primary-hover font-medium underline transition-colors self-start"
                >
                  {t.verifyEmail}
                </Link>
              )}
            </div>
          )}

          <TButton
            type="submit"
            loading={loading}
            className="w-full mt-2 shadow-sm hover:shadow-glow"
          >
            {loading ? t.loggingIn : t.login}
          </TButton>
        </div>

        {/* Footer actions with logical multi-directional padding support */}
        <div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm pt-4 border-t border-border/40">
          <Link
            href="/forgot-password"
            className="text-primary hover:text-primary-hover font-medium transition-colors"
          >
            {t.forgotPassword}
          </Link>

          <div className="text-text-secondary">
            {t.dontHaveAccount}{" "}
            <Link
              href="/register"
              className="text-primary hover:text-primary-hover font-semibold transition-colors inline-block px-1"
            >
              {t.register}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export { LoginForm };
