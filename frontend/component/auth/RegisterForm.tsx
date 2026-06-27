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
    if (field == FieldRegisterEnum.email) setEmail(value);
    if (field == FieldRegisterEnum.password) setPassword(value);
    if (field == FieldRegisterEnum.firstName) setFirstName(value);
    if (field == FieldRegisterEnum.lastName) setLastName(value);
    if (field == FieldRegisterEnum.userName) setUserName(value);
    if (field == FieldRegisterEnum.confirmPassword) setConfirmPassword(value);
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
      const code =
        err?.response?.data?.errorCode ?? err?.response?.data?.errorCode;

      if (code === ErrorCodeEnum.EmailAlreadyExists)
        setApiError({
          link: "/login",
          message:
            t.RegisterErrorCodeEnum[
              code as keyof typeof t.RegisterErrorCodeEnum
            ] ||
            err?.response?.data?.message ||
            t.unknownError,
        });
      else {
        setApiError({
          link: "",
          message: err?.response?.data?.message || t.unknownError,
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
        placeholder={t.placeholder.firstName}
        value={firstName}
        onChange={(e) =>
          handleChange(FieldRegisterEnum.firstName, e.target.value)
        }
        error={errors.firstName}
        required
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
      />
      <TTextField
        label={t.email}
        placeholder={t.placeholder.email}
        value={email}
        onChange={(e) => handleChange(FieldRegisterEnum.email, e.target.value)}
        error={errors.email}
        type="email"
        required
        className="md:col-span-2"
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
        className="md:col-span-2"
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
        className="md:col-span-2"
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
        className="md:col-span-2"
      />

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
      <TButton loading={loading} className="w-full" onClick={register}>
        {loading ? t.createElipses : t.create}
      </TButton>

      <div className="text-sm text-center">
        {t.haveAccount}{" "}
        <a href="/login" className="text-primary font-medium">
          {t.signIn}
        </a>
      </div>
    </div>
  );
}
export { RegisterForm };
