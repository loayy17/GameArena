"use client";

import CustomTextField from "@/component/custom_text_field";
import TButton from "@/component/custom_button";
import CustomAnimation from "@/component/animation";
import CustomDivider from "@/component/custom_divider";
import SignInAnther from "@/component/sign_in_anther";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../network";
import { request } from "https";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
      const Router = useRouter();
        const accessToken = request.cookies.get("Access-token")?.value;
        if (!accessToken && (!request.nextUrl.pathname.startsWith("/login")
            || request.nextUrl.pathname.startsWith("/register") )) {
            return Router.replace("/login");
        }
  }, []);
  const router = useRouter();
  const login = async () => {
    try {
      if (!email || !password) {
        return;
      }
      setLoading(true);
      console.log(email, password);
      await api.post("api/auth/login", {
        email: email,
        password: password
      });
      router.replace("/home");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg">
      <CustomAnimation title="Welcome Back" pathAnimation="/game.json" />

      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-text mb-1">Sign in</h1>
          <p className="text-text-secondary mb-8 text-sm">
            Choose your preferred sign-in method
          </p>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <CustomTextField
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <CustomTextField
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="flex items-center justify-between">

              <a href="#" className="text-sm text-primary font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <TButton title={loading ? "Logging in..." : "Sign in"} disabled={loading} onClick={login} />
          </form>

          <p className="text-center text-sm text-text-secondary mt-8">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-primary font-medium hover:underline">
              Register
            </a>
          </p>
          <CustomDivider />
          <SignInAnther />
        </div>
      </div>
    </div>
  );
}
