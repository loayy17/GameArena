"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";
import { AuthAnimation } from "./AuthAnimation";
import { AuthFlowAnimationEnum } from "@/types";
import { LangTheme } from "../common/LangTheme";

function AuthLayout({
  page,
  children,
}: {
  page: AuthFlowAnimationEnum;
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row login-panel-bg lg:bg-none relative transition-colors duration-200">
        <div className="absolute top-4 right-4 z-50">
          <LangTheme collapsed={false} className="flex gap-2" />
        </div>

        {/* Dynamic Animation Area */}
        <AuthAnimation
          page={page}
          pathAnimation="/game.json"
          className="bg-transparent lg:login-panel-bg  lg:shadow-none"
        />

        {/* Content Panel Box */}
        <div className="flex-1 flex items-center justify-center lg:bg-bg">
          <div className="w-full max-w-md animate-fade-in">{children}</div>
        </div>
      </div>
    );
  }

  return null;
}

export { AuthLayout };
