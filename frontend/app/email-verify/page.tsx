"use client";

import { useRouter } from "next/navigation";
import { AuthLayout } from "@/component/auth/AuthLayout";
import { OtpForm } from "@/component/auth/OtpForm";
import { authFlow } from "@/repositories/proxy/authflow";
import { AuthFlowAnimationEnum } from "@/types";
import { useEffect } from "react";

function EmailVerifyPage() {
  const router = useRouter();
  const flow = authFlow.get();

  const email = flow.email;
  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  if (!email) return null;

  return (
    <AuthLayout page={AuthFlowAnimationEnum.VERIFY_OTP}>
      <OtpForm
        email={email}
        onSuccess={() => {
          authFlow.clear();
          router.replace("/home");
        }}
      />
    </AuthLayout>
  );
}

export default EmailVerifyPage;
