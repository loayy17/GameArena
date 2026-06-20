"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import api from "../network";

import CustomAnimation from "@/component/animation";
import CustomTextField from "@/component/TTextField";
import TButton from "@/component/TButton";

import { useTranslation } from "@/Hooks/useTranslation";

import ar from "./i18n/ar.i18n";
import en, { LoginTranslation } from "./i18n/en.i18n";

export default function Login() {
  const t = useTranslation({ en, ar }) as LoginTranslation;

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = email.trim().length > 0 && password.trim().length > 0;

  const login = async () => {
    if (!isValid) {
      setError(t.fillRequiredFields);
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      router.replace("/home");
    } catch (error: any) {
      const message = error?.response?.data?.message || t.invalidCredentials;

      setError(message);

      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await login();
  };

  return (
    <div className="min-h-screen flex">
      <CustomAnimation title={t.WelcomeBack} pathAnimation="/game.json" />

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-text mb-1">{t.signIn}</h1>

          <p className="text-text-secondary mb-8 text-sm">
            {t.ChooseYourPreferredSignInMethod}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <CustomTextField
              label={t.email}
              type="email"
              placeholder={t.email}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <CustomTextField
              label={t.password}
              type="password"
              placeholder={t.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <div className="text-sm text-red-500">{error}</div>}

            <div className="flex items-center justify-between">
              <Link
                href="/forgot-password"
                className="text-sm text-primary font-medium hover:underline"
              >
                {t.forgotPassword}
              </Link>
            </div>

            <TButton
              type="submit"
              title={loading ? t.loggingIn : t.signIn}
              disabled={loading || !isValid}
              loading={loading}
            />
          </form>

          <p className="text-center text-sm text-text-secondary mt-8">
            {t.DontHaveAccount}{" "}
            <Link
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              {t.Register}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
