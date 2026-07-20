"use client";
import { AuthLayout } from "../layout";
import { RegisterForm } from "@/component/auth/RegisterForm";

function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}

export default RegisterPage;
