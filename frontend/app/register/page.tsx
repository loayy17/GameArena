"use client";
import { AuthLayout } from "@/component/auth/AuthLayout";
import { RegisterForm } from "@/component/auth/RegisterForm";
import { AuthFlowAnimationEnum } from "@/types";

function Register() {
  return (
    <AuthLayout page={AuthFlowAnimationEnum.REGISTER}>
      <RegisterForm />
    </AuthLayout>
  );
}
export default Register;
