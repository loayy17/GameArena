"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AuthAnimation } from "@/component/auth/AuthAnimation";
import { AuthFlowAnimationEnum } from "@/domain/enum/AuthFlowAnimationEnum";
import { LangTheme } from "@/component/common/LangTheme";
import { useAuth } from "@/app/providers/AuthProvider";
import { GSpinner } from "@/component/common/GSpinner";

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
        <GSpinner size="lg" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row login-panel-bg lg:bg-none relative">
      <div className="absolute top-4 right-4 z-50">
        <LangTheme collapsed={false} className="flex gap-2" />
      </div>

      <AuthAnimation
        page={page}
        pathAnimation="/game.json"
        className="bg-transparent lg:login-panel-bg"
      />

      <div className="flex-1 flex items-center justify-center lg:bg-bg">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}

function AuthRouteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export { AuthLayout };
export default AuthRouteLayout;
