"use client";

import AuthLayout from "@/component/auth/AuthLayout";
import LoginForm from "@/component/auth/loginForm";
import { AuthFlowAnimationEnum } from "@/types";

export default function Page() {
  return (
    <AuthLayout page={AuthFlowAnimationEnum.LOGIN}>
      <LoginForm />
    </AuthLayout>
  );
}
