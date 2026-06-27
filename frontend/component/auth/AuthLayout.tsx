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
      <div className="flex h-screen items-center justify-center bg-bg-dark">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-[linear-gradient(145deg,#2a1a6e_0%,#0f0530_55%,#1a0840_100%)] lg:bg-none">
        {/* Animation – its background is transparent on medium, restored on large */}
        <LangTheme collapsed={false} className="absolute flex gap-2 right-0 right-2 top-2"/>
        <AuthAnimation
          page={page}
          pathAnimation="/game.json"
          className="bg-transparent lg:bg-[linear-gradient(145deg,#2a1a6e_0%,#0f0530_55%,#1a0840_100%)]"
        />
        {/* Form – no card styling, seamless continuation of the background */}
        <div className="flex-1 flex items-center justify-center px-6 pb-10 pt-4 lg:p-6">
          <div>{children}</div>
        </div>
      </div>
    );
  }

  return null;
}

export { AuthLayout };
