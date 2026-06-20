"use client";

import CustomTextField from "@/component/TTextField";
import TButton from "@/component/TButton";
import CustomAnimation from "@/component/animation";
import { useState } from "react";
import api from "../network";
import { useTranslation } from "@/Hooks/useTranslation";
import ar from "./i18n/ar.i18n";
import en, { TRegisterTranslation } from "./i18n/en.i18n";
import OtpPage from "@/component/OtpPage";

export default function Register() {
  const t = useTranslation({ en, ar }) as TRegisterTranslation;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const [showOtp, setShowOtp] = useState(false);
  const register = async () => {
    try {
      if (!email || !password || !firstName || !lastName || !username) {
        return;
      }
      setLoading(true);
      await api.post("/auth/register", {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        username: username,
      });
      setShowOtp(true);
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showOtp) {
    return <OtpPage email={email} />;
  } else
    return (
      <div className="min-h-screen flex">
        <CustomAnimation title={t.joinUs} />

        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold text-text mb-1">{t.title}</h1>
            <p className="text-text-secondary mb-8 text-sm">{t.subtitle}</p>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <CustomTextField
                label={t.firstName}
                type="text"
                placeholder={t.firstNamePlaceholder}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <CustomTextField
                label={t.lastName}
                type="text"
                placeholder={t.lastNamePlaceholder}
                onChange={(e) => setLastName(e.target.value)}
              />
              <CustomTextField
                label={t.username}
                type="text"
                placeholder={t.usernamePlaceholder}
                onChange={(e) => setUsername(e.target.value)}
              />
              <CustomTextField
                label={t.email}
                type="email"
                placeholder={t.emailPlaceholder}
                onChange={(e) => setEmail(e.target.value)}
              />
              <CustomTextField
                label={t.password}
                type="password"
                placeholder={t.passwordPlaceholder}
                onChange={(e) => setPassword(e.target.value)}
              />

              <TButton
                title={loading ? t.creating : t.create}
                disabled={loading}
                onClick={register}
              />
            </form>

            <p className="text-center text-sm text-text-secondary mt-8">
              {t.haveAccount}{" "}
              <a
                href="/login"
                className="text-primary font-medium hover:underline"
              >
                {t.signIn}
              </a>
            </p>
          </div>
        </div>
      </div>
    );
}
