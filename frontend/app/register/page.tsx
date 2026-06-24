"use client";
import AuthLayout from "@/component/auth/AuthLayout";
import RegisterForm from "@/component/auth/RegisterForm";
import { AuthFlowAnimationEnum } from "@/types";

export default function Page() {
  return (
    <AuthLayout page={AuthFlowAnimationEnum.REGISTER}>
      <RegisterForm />
    </AuthLayout>
  );
}
