"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/network";
import TTextField from "@/component/common/TTextField";
import TButton from "@/component/common/TButton";
import { authFlow } from "@/lib/authflow";
import { emailValidator, passwordValidator } from "@/utils";
import en, { TRegisterTranslation } from "@/app/register/i18n/en.i18n";
import ar from "@/app/register/i18n/ar.i18n";
import {
  default as EnTextField,
  TTextFieldTranslation,
} from "@/component/i18n/TTextField/en.i18n";
import { default as ArTextField } from "@/component/i18n/TTextField/ar.i18n";
import { useTranslation } from "@/Hooks/useTranslation";
import { ErrorCode, TError, TFieldRegister } from "@/types";
import Link from "next/link";

export default function RegisterForm() {
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
  const [username, setUsername] = useState("");
  const [apiError, setApiError] = useState({
    link: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
  });
  const validate = (
    emailVal: string,
    passwordVal: string,
    firstNameVal: string,
    lastNameVal: string,
    usernameVal: string,
  ) => {
    return {
      email: emailValidator(t)(emailVal) || "",
      password: passwordValidator(t)(passwordVal) || "",
      confirmPassword: !confirmPassword.trim()
        ? t.dynamicFieldRequired(t.firstName)
        : passwordVal !== confirmPassword
          ? t.invalidConfirmPassword
          : "",
      firstName: firstNameVal.trim() ? "" : t.dynamicFieldRequired(t.firstName),
      lastName: lastNameVal.trim() ? "" : t.dynamicFieldRequired(t.lastName),
      username: usernameVal.trim() ? "" : t.dynamicFieldRequired(t.username),
    };
  };
  const handleChange = (field: TFieldRegister, value: string) => {
    if (field == "email") setEmail(value);
    if (field == "password") setPassword(value);
    if (field == "firstName") setFirstName(value);
    if (field == "lastName") setLastName(value);
    if (field == "username") setUsername(value);
    if (field == "confirmPassword") setConfirmPassword(value);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };
  const register = async () => {
    try {
      const nextErrors = validate(
        email,
        password,
        firstName,
        lastName,
        username,
      );
      setErrors(nextErrors);
      if (Object.values(nextErrors).some((error) => error)) return;
      setLoading(true);
      await api.post("/auth/register", {
        email,
        password,
        firstName,
        lastName,
        username,
      });

      authFlow.set({
        email,
        register: { firstName, lastName, username, password },
      });

      router.push("/email-verify");
    } catch (e) {
      const err = e as TError;
      const code = err?.response?.data?.errorCode;

      if (code === ErrorCode.EMailAlreadyExists)
        setApiError({
          link: "/login",
          message:
            t.RegisterErrorCodeEnum[
              code as keyof typeof t.RegisterErrorCodeEnum
            ] ||
            err?.response?.data?.message ||
            "An error occurred",
        });
      else {
        setApiError({
          link: "",
          message: err?.response?.data?.message || "An error occurred",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      <TTextField
        label={t.firstName}
        placeholder={t.firstNamePlaceholder}
        value={firstName}
        onChange={(v) => handleChange("firstName", v)}
        error={errors.firstName}
        required
      />
      <TTextField
        label={t.lastName}
        placeholder={t.lastNamePlaceholder}
        value={lastName}
        onChange={(v) => handleChange("lastName", v)}
        error={errors.lastName}
        required
      />
      <TTextField
        label={t.email}
        placeholder={t.emailPlaceholder}
        value={email}
        onChange={(v) => handleChange("email", v)}
        error={errors.email}
        type="email"
        required
        className="md:col-span-2"
      />
      <TTextField
        label={t.username}
        placeholder={t.usernamePlaceholder}
        value={username}
        onChange={(v) => handleChange("username", v)}
        error={errors.username}
        required
        className="md:col-span-2"
      />
      <TTextField
        label={t.password}
        placeholder={t.passwordPlaceholder}
        value={password}
        onChange={(v) => handleChange("password", v)}
        error={errors.password}
        type="password"
        required
        className="md:col-span-2"
      />
      <TTextField
        label={t.confirmPassword}
        placeholder={t.confirmPasswordPlaceholder}
        value={confirmPassword}
        onChange={(v) => handleChange("confirmPassword", v)}
        error={errors.confirmPassword}
        type="password"
        required
        className="md:col-span-2"
      />

      <br />
      {apiError.message && (
        <div className="text-sm text-red-500">
          {apiError.message}{" "}
          {apiError.link && (
            <Link href={apiError.link} className="text-primary font-medium">
              {t.goToLogin}
            </Link>
          )}
        </div>
      )}
      <TButton
        title={loading ? t.createElipses : t.create}
        loading={loading}
        onClick={register}
      />
      <br />
      <div className="text-sm text-center">
        {t.haveAccount}{" "}
        <a href="/login" className="text-primary font-medium">
          {t.signIn}
        </a>
      </div>
    </div>
  );
}
