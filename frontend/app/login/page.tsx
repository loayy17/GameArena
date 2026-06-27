"use client";

import { AuthLayout } from "@/component/auth/AuthLayout";
import { LoginForm } from "@/component/auth/loginForm";
import { AuthFlowAnimationEnum } from "@/types";

function LoginPage() {
  return (
    <AuthLayout page={AuthFlowAnimationEnum.LOGIN}>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
