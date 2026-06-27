"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TTextField } from "@/component/common/TTextField";
import { TButton } from "@/component/common/TButton";
import { authFlow } from "@/repositories/proxy/authflow";
import { emailValidator, passwordValidator } from "@/utils";
import { en, type TRegisterTranslation } from "@/app/register/i18n/en.i18n";
import { ar } from "@/app/register/i18n/ar.i18n";
import {
  en as EnTextField,
  TTextFieldTranslation,
} from "@/component/i18n/TTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import Link from "next/link";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import { authService } from "@/services/def/AuthService";
import { FieldRegisterEnum } from "@/types/meta/TFieldRegister";
import { AxiosError } from "axios";
import { IApiResponse } from "@/domain/meta/IApiResponse";

function RegisterForm() {
  const router = useRouter();
  const t = useTranslation({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
  }) as TRegisterTranslation & TTextFieldTranslation;
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

  const validate = (
    emailVal: string,
    passwordVal: string,
    firstNameVal: string,
    lastNameVal: string,
    userNameVal: string,
  ) => {
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
      const nextErrors = validate(
        email,
        password,
        firstName,
        lastName,
        userName,
      );
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
      authFlow.set({
        email,
        register: { firstName, lastName, userName, password },
      });

      router.push("/email-verify");
    } catch (e) {
      const err = e as AxiosError<IApiResponse<unknown>>;
      const code = err?.response?.data?.errorCode;

      const errorMessage =
        t.RegisterErrorCodeEnum[code as keyof typeof t.RegisterErrorCodeEnum] ||
        err?.response?.data?.message ||
        t.unknownError;

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
    <div className="w-full max-w-xl p-6 sm:p-8 bg-surface-alt/40 border border-border/60 rounded-lg shadow-md ">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TTextField
          label={t.firstName}
          placeholder={t.placeholder.firstName}
          value={firstName}
          onChange={(e) =>
            handleChange(FieldRegisterEnum.firstName, e.target.value)
          }
          error={errors.firstName}
          required
          className="transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
        />
        <TTextField
          label={t.lastName}
          placeholder={t.placeholder.lastName}
          value={lastName}
          onChange={(e) =>
            handleChange(FieldRegisterEnum.lastName, e.target.value)
          }
          error={errors.lastName}
          required
          className="transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
        />
        <TTextField
          label={t.email}
          placeholder={t.placeholder.email}
          value={email}
          onChange={(e) =>
            handleChange(FieldRegisterEnum.email, e.target.value)
          }
          error={errors.email}
          type="email"
          required
          className="md:col-span-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
        />
        <TTextField
          label={t.userName}
          placeholder={t.placeholder.userName}
          value={userName}
          onChange={(e) =>
            handleChange(FieldRegisterEnum.userName, e.target.value)
          }
          error={errors.userName}
          required
          className="md:col-span-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
        />
        <TTextField
          label={t.password}
          placeholder={t.placeholder.password}
          value={password}
          onChange={(e) =>
            handleChange(FieldRegisterEnum.password, e.target.value)
          }
          error={errors.password}
          type="password"
          required
          className="md:col-span-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
        />
        <TTextField
          label={t.confirmPassword}
          placeholder={t.placeholder.confirmPassword}
          value={confirmPassword}
          onChange={(e) =>
            handleChange(FieldRegisterEnum.confirmPassword, e.target.value)
          }
          error={errors.confirmPassword}
          type="password"
          required
          className="md:col-span-2 transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/40"
        />
      </div>

      {apiError.message && (
        <div className="text-sm mt-4 p-3 rounded-md bg-error-bg border border-error/20 text-error flex flex-col gap-1">
          <span>{apiError.message}</span>
          {apiError.link && (
            <Link
              href={apiError.link}
              className="text-primary hover:text-primary-hover font-medium underline transition-colors self-start"
            >
              {t.goToLogin}
            </Link>
          )}
        </div>
      )}

      <div className="mt-6 space-y-4">
        <TButton
          loading={loading}
          className="w-full shadow-sm hover:shadow-glow"
          onClick={register}
        >
          {loading ? t.createElipses : t.create}
        </TButton>

        <div className="text-sm text-center text-text-secondary pt-2 border-t border-border/40">
          {t.haveAccount}{" "}
          <Link
            href="/login"
            className="text-primary hover:text-primary-hover font-semibold transition-colors px-1"
          >
            {t.signIn}
          </Link>
        </div>
      </div>
    </div>
  );
}

export { RegisterForm };
