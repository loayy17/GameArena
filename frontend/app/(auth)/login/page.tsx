"use client";

import { AuthLayout } from "../layout";
import { LoginForm } from "@/component/auth/LoginForm";
import { AuthFlowAnimationEnum } from "@/domain/enum/AuthFlowAnimationEnum";

function LoginPage() {
  return (
    <AuthLayout page={AuthFlowAnimationEnum.LOGIN}>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
