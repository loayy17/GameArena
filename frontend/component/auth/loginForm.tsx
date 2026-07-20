"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { en as EnTextField, type GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { en, type TLoginTranslation } from "@/app/(auth)/login/i18n/en.i18n";
import { ar } from "@/app/(auth)/login/i18n/ar.i18n";
import { emailValidator, passwordValidator } from "@/utils";
import { useAuth } from "@/app/providers/AuthProvider";
import { authService } from "@/services/def/AuthService";
import { AxiosError } from "axios";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import type { IApiResponse } from "@/domain/meta/IApiResponse";
import type { TFieldLogin } from "@/domain/type/TCommon";

function LoginForm() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TLoginTranslation & GTextFieldTranslation;

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
      const data = err?.response?.data;
      const code = data?.errorCode;
      const errorMessage = t.loginErrorCodeEnum[code as keyof typeof t.loginErrorCodeEnum] || data?.message || t.unknownError;

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
      <div className="flex items-center gap-3 mb-8">
        <GIcon icon={LogIn} size="xl" tile tileSize="xl" tileGradient="bg-primary" tileColor="on-primary" />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-text tracking-tight">{t.login}</h1>
          <p className="text-sm text-text-muted mt-0.5">{t.loginDescription}</p>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-5">
        {apiError.message && (
          <div role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <p>{apiError.message}</p>
            {apiError.link && (
              <Link href={apiError.link} className="mt-1 inline-block font-semibold text-primary hover:text-primary-hover">
                {t.verifyEmail}
              </Link>
            )}
          </div>
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
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <GTextField
            label={t.password}
            placeholder={t.placeholder.password}
            value={password}
            error={errors.password}
            type="password"
            autoComplete="current-password"
            required
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <GButton type="submit" loading={loading} fullWidth>
            {loading ? t.loggingIn : t.login}
          </GButton>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 text-xs sm:text-sm pt-4 border-t border-border/40">
          <Link href="/forgot-password" className="text-primary hover:text-primary-hover font-medium">
            {t.forgotPassword}
          </Link>

          <div className="text-text-secondary">
            {t.dontHaveAccount}{" "}
            <Link href="/register" className="text-primary hover:text-primary-hover font-semibold px-1">
              {t.register}
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export { LoginForm };
