"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CustomTextField from "@/component/custom_text_field";
import TButton from "@/component/TButton";
import CustomAnimation from "@/component/animation";

import { authApi } from "@/lib/auth.api";
import { useTranslation } from "@/Hooks/useTranslation";

import en, { LoginTranslation } from "../login/i18n/en.i18n";
import ar from "../login/i18n/ar.i18n";

export default function ForgotPassword() {
  const t = useTranslation({ en, ar }) as LoginTranslation;

  const router = useRouter();

  const [step, setStep] = useState<"email" | "reset">("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /**
   * STEP 1: Send OTP
   */
  const sendOtp = async () => {
    if (!email.trim()) {
      setError("Email required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await authApi.forgotPassword(email);

      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  /**
   * STEP 2: Reset password
   */
  const resetPassword = async () => {
    if (!otp || !newPassword) {
      setError("Fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await authApi.resetPassword({
        email,
        otp,
        newPassword,
      });

      router.replace("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <CustomAnimation title="Recover Account" pathAnimation="/game.json" />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-5">
          <h1 className="text-3xl font-bold">Forgot Password</h1>

          {/* ERROR */}
          {error && <div className="text-sm text-red-500">{error}</div>}

          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <>
              <CustomTextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TButton
                title={loading ? "Sending..." : "Send Code"}
                loading={loading}
                disabled={loading}
                onClick={sendOtp}
              />
            </>
          )}

          {/* STEP 2: RESET */}
          {step === "reset" && (
            <>
              <CustomTextField
                label="OTP Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <CustomTextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <TButton
                title={loading ? "Resetting..." : "Reset Password"}
                loading={loading}
                disabled={loading}
                onClick={resetPassword}
              />

              <button
                className="text-xs text-primary mt-2"
                onClick={sendOtp}
                disabled={loading}
              >
                Resend code
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
