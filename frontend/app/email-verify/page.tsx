"use client";

import { useRouter } from "next/navigation";
import AuthLayout from "@/component/auth/AuthLayout";
import OtpForm from "@/component/auth/OtpForm";
import { authFlow } from "@/lib/authflow";
import { AuthFlowAnimationEnum } from "@/types";

export default function Page() {
  const router = useRouter();
  const flow = authFlow.get();

  const email = flow.email;

  if (!email) {
    router.replace("/register");
    return null;
  }

  return (
    <AuthLayout page={AuthFlowAnimationEnum.VERIFY_OTP}>
      <OtpForm
        email={email}
        onSuccess={(otp) => {
          authFlow.clear();
          router.replace("/home");
        }}
      />
    </AuthLayout>
  );
}
