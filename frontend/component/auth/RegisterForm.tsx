"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import { GTextField } from "@/component/common/GTextField";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { emailValidator, passwordValidator } from "@/utils";
import { en, type TRegisterTranslation } from "@/app/(auth)/register/i18n/en.i18n";
import { ar } from "@/app/(auth)/register/i18n/ar.i18n";
import { en as EnTextField, GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { useTranslation } from "@/hooks/useSetting";
import Link from "next/link";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import { authService } from "@/services/def/AuthService";
import { FieldRegisterEnum } from "@/domain/enum/FieldRegisterEnum";
import { AxiosError } from "axios";
import type { IApiResponse } from "@/domain/meta/IApiResponse";

function RegisterForm() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TRegisterTranslation & GTextFieldTranslation;
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [apiError, setApiError] = useState({ link: "", message: "" });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userName: "",
  });

  const validate = (emailVal: string, passwordVal: string, firstNameVal: string, lastNameVal: string, userNameVal: string) => {
    return {
      email: emailValidator(t)(emailVal) || "",
      password: passwordValidator(t)(passwordVal) || "",
      confirmPassword: !confirmPassword.trim()
        ? t.dynamicFieldRequired(t.confirmPassword)
        : passwordVal !== confirmPassword
          ? t.invalidConfirmPassword
          : "",
      firstName: firstNameVal.trim() ? "" : t.dynamicFieldRequired(t.firstName),
      lastName: lastNameVal.trim() ? "" : t.dynamicFieldRequired(t.lastName),
      userName: userNameVal.trim() ? "" : t.dynamicFieldRequired(t.userName),
    };
  };

  const handleChange = (field: FieldRegisterEnum, value: string) => {
    if (field === FieldRegisterEnum.email) setEmail(value);
    if (field === FieldRegisterEnum.password) setPassword(value);
    if (field === FieldRegisterEnum.firstName) setFirstName(value);
    if (field === FieldRegisterEnum.lastName) setLastName(value);
    if (field === FieldRegisterEnum.userName) setUserName(value);
    if (field === FieldRegisterEnum.confirmPassword) setConfirmPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const register = async () => {
    try {
      const nextErrors = validate(email, password, firstName, lastName, userName);
      setErrors(nextErrors);
      if (Object.values(nextErrors).some((error) => error)) return;
      setLoading(true);

      await authService.register({
        email,
        password,
        firstName,
        lastName,
        userName,
      });
      router.push("/email-verify?email=" + encodeURIComponent(email));
    } catch (e) {
      const err = e as AxiosError<IApiResponse<unknown>>;
      const data = err?.response?.data;
      const code = data?.errorCode;

      const errorMessage =
        code !== undefined && t.RegisterErrorCodeEnum[code as keyof typeof t.RegisterErrorCodeEnum]
          ? t.RegisterErrorCodeEnum[code as keyof typeof t.RegisterErrorCodeEnum]
          : data?.message || t.unknownError;

      if (code === ErrorCodeEnum.EmailAlreadyExists) {
        setApiError({ link: "/login", message: errorMessage });
      } else {
        setApiError({ link: "", message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <GIcon icon={UserPlus} size="xl" tile tileSize="xl" tileGradient="bg-primary" tileColor="on-primary" />
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-text tracking-tight">{t.register}</h1>
          <p className="text-sm text-text-muted mt-0.5">{t.createAccount}</p>
        </div>
      </div>
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          register();
        }}>
        {apiError.message && (
          <div role="alert" className="rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            <p>{apiError.message}</p>
            {apiError.link && (
              <Link href={apiError.link} className="mt-1 inline-block font-semibold text-primary hover:text-primary-hover">
                {t.signIn}
              </Link>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <GTextField
            label={t.firstName}
            placeholder={t.placeholder.firstName}
            value={firstName}
            error={errors.firstName}
            required
            onChange={(e) => handleChange(FieldRegisterEnum.firstName, e.target.value)}
          />
          <GTextField
            label={t.lastName}
            placeholder={t.placeholder.lastName}
            value={lastName}
            error={errors.lastName}
            required
            onChange={(e) => handleChange(FieldRegisterEnum.lastName, e.target.value)}
          />
          <div className="md:col-span-2">
            <GTextField
              label={t.email}
              placeholder={t.placeholder.email}
              value={email}
              error={errors.email}
              type="email"
              required
              onChange={(e) => handleChange(FieldRegisterEnum.email, e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <GTextField
              label={t.userName}
              placeholder={t.placeholder.userName}
              value={userName}
              error={errors.userName}
              autoComplete="username"
              required
              onChange={(e) => handleChange(FieldRegisterEnum.userName, e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <GTextField
              label={t.password}
              placeholder={t.placeholder.password}
              value={password}
              error={errors.password}
              type="password"
              autoComplete="new-password"
              required
              onChange={(e) => handleChange(FieldRegisterEnum.password, e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <GTextField
              label={t.confirmPassword}
              placeholder={t.placeholder.confirmPassword}
              value={confirmPassword}
              error={errors.confirmPassword}
              type="password"
              autoComplete="new-password"
              required
              onChange={(e) => handleChange(FieldRegisterEnum.confirmPassword, e.target.value)}
            />
          </div>
        </div>

        <GButton loading={loading} fullWidth type="submit">
          {loading ? t.createElipses : t.create}
        </GButton>

        <div className="text-sm text-center text-text-secondary pt-2 border-t border-border/40">
          {t.haveAccount}{" "}
          <Link href="/login" className="text-primary hover:text-primary-hover font-semibold px-1">
            {t.signIn}
          </Link>
        </div>
      </form>
    </div>
  );
}

export { RegisterForm };
