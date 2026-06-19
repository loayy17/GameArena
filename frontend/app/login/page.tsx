"use client";

import CustomTextField from "@/component/custom_text_field";
import TButton from "@/component/custom_button";
import CustomAnimation from "@/component/animation";
import CustomDivider from "@/component/custom_divider";
import SignInAnther from "@/component/sign_in_anther";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../network";
import { useTranslation } from "@/Hooks/useTranslation";
import ar from "./i18n/ar.i18n";
import en, { LoginTranslation } from "./i18n/en.i18n";

export default function Login() {
  const t = useTranslation({ en, ar }) as LoginTranslation;
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const login = async () => {
    try {
      if (!email || !password) {
        return;
      }
      setLoading(true);
      await api.post("/auth/login", {
        email: email,
        password: password,
      });
      router.replace("/home");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex bg">
      <CustomAnimation title={t.WelcomeBack} pathAnimation="/game.json" />

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-text mb-1">{t.signIn}</h1>
          <p className="text-text-secondary mb-8 text-sm">
            {t.ChooseYourPreferredSignInMethod}
          </p>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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

            <div className="flex items-center justify-between">
              <a
                href="#"
                className="text-sm text-primary font-medium hover:underline"
              >
                {t.forgotPassword}
              </a>
            </div>

            <TButton
              title={loading ? t.loggingIn : t.signIn}
              disabled={loading}
              onClick={login}
            />
          </form>

          <p className="text-center text-sm text-text-secondary mt-8">
            {t.DontHaveAccount}{" "}
            <a
              href="/register"
              className="text-primary font-medium hover:underline"
            >
              {t.Register}
            </a>
          </p>
          <CustomDivider />
          <SignInAnther />
        </div>
      </div>
    </div>
  );
}
