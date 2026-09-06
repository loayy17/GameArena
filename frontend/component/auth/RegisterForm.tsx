"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import Link from "next/link";

import { GTextField } from "@/component/common/GTextField";
import { GCheckbox } from "@/component/common/GCheckbox";
import { GButton } from "@/component/common/GButton";
import { GAlert } from "@/component/common/GAlert";
import { emailValidator, passwordValidator } from "@/lib/utils";
import { en } from "@/app/(auth)/register/i18n/en.i18n";
import { ar } from "@/app/(auth)/register/i18n/ar.i18n";
import { fr } from "@/app/(auth)/register/i18n/fr.i18n";
import { en as EnTextField } from "@/component/i18n/GTextField/en.i18n";
import { ar as ArTextField } from "@/component/i18n/GTextField/ar.i18n";
import { fr as FrTextField } from "@/component/i18n/GTextField/fr.i18n";
import { useTranslation } from "@/hooks/useSetting";
import { ErrorCodeEnum } from "@/domain/enum/ErrorCodeEnum";
import { authService } from "@/services/def/AuthService";
import { toErrorCode, useErrorMessage } from "@/hooks/useErrorMessage";
import { FieldRegisterEnum } from "@/domain/enum/FieldRegisterEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

import { PasswordField } from "./PasswordField";
import { AuthFrame } from "./AuthFrame";

import type { TRegisterTranslation } from "@/app/(auth)/register/i18n/en.i18n";
import type { GTextFieldTranslation } from "@/component/i18n/GTextField/en.i18n";

function RegisterForm() {
  const router = useRouter();
  const t = useTranslation<TRegisterTranslation & GTextFieldTranslation>({
    en: { ...en, ...EnTextField },
    ar: { ...ar, ...ArTextField },
    fr: { ...fr, ...FrTextField },
  });
  const [loading, setLoading] = useState(false);
  const resolveError = useErrorMessage();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [policyAndTerms, setPolicyAndTerms] = useState(false);
  const [apiError, setApiError] = useState({ link: "", message: "" });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    userName: "",
    policyAndTerms: "",
  });

  const validate = (
    emailVal: string,
    passwordVal: string,
    firstNameVal: string,
    lastNameVal: string,
    userNameVal: string,
    policyAndTermsVal: boolean,
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
      policyAndTerms: policyAndTermsVal ? "" : t.dynamicFieldRequired(t.acceptPolicyAndTerms),
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
      const nextErrors = validate(email, password, firstName, lastName, userName, policyAndTerms);
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
      const code = toErrorCode(e);
      const errorMessage = resolveError(code);

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
      <AuthFrame icon={UserPlus} title={t.register} description={t.createAccount}>
      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          register();
        }}>
        {apiError.message && (
          <GAlert severity={AccentColorEnum.Danger}>
            <p className="font-medium">{apiError.message}</p>
            {apiError.link && (
              <Link
                href={apiError.link}
                className="mt-1 inline-block font-semibold text-primary hover:text-primary-hover underline underline-offset-2">
                {t.signIn}
              </Link>
            )}
          </GAlert>
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
              autoComplete="email"
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
            <PasswordField
              label={t.password}
              placeholder={t.placeholder.password}
              value={password}
              error={errors.password}
              autoComplete="new-password"
              required
              hint={t.passwordHint}
              onChange={(e) => handleChange(FieldRegisterEnum.password, e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <PasswordField
              label={t.confirmPassword}
              placeholder={t.placeholder.confirmPassword}
              value={confirmPassword}
              error={errors.confirmPassword}
              autoComplete="new-password"
              required
              onChange={(e) => handleChange(FieldRegisterEnum.confirmPassword, e.target.value)}
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <GCheckbox error={errors.policyAndTerms} required checked={policyAndTerms} onChange={(e) => setPolicyAndTerms(e.target.checked)}>
            <span className="text-sm text-text-secondary">
              {t.acceptPolicyAndTerms}
              <Link href="/privacy" className="text-primary hover:text-primary-hover font-semibold px-1">
                {t.policy}
              </Link>
              {t.and}
              <Link href="/terms" className="text-primary hover:text-primary-hover font-semibold px-1">
                {t.terms}
              </Link>
            </span>
          </GCheckbox>
        </div>

        <GButton loading={loading} type="submit" className="w-full">
          {t.create}
        </GButton>

        <div className="text-sm text-center text-text-secondary pt-4 border-t border-border/40">
          {t.haveAccount}
          <Link href="/login" className="text-primary hover:text-primary-hover font-semibold px-1">
            {t.signIn}
          </Link>
        </div>
      </form>
      </AuthFrame>
    </div>
  );
}

export { RegisterForm };
