"use client";

import { AuthLayout } from "../layout";
import { LoginForm } from "@/component/auth/loginForm";

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

export default LoginPage;
