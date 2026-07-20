"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Sidebar } from "@/component/SideBar";
import { SocialPanel } from "@/component/SocialPanel/SocialPanel";
import { BottomNav } from "@/component/BottomNav";
import { ConnectionProvider } from "@/app/providers/ConnectionProvider";
import { GameProvider } from "@/app/providers/GameProvider";
import { DashboardNotificationsProvider } from "@/app/providers/DashboardNotificationsProvider";
import { ActiveGameBanner } from "@/component/games/ActiveGameBanner";
import { GSpinner } from "@/component/common/GSpinner";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);

  useEffect(() => {
    if (!loading && !user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full bg-bg items-center justify-center">
        <GSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen w-full bg-bg items-center justify-center">
        <GSpinner size="lg" />
      </div>
    );
  }

  return (
    <ConnectionProvider>
      <GameProvider>
        <DashboardNotificationsProvider>
          <div className="flex h-screen w-full bg-bg text-text overflow-hidden font-sans antialiased">
            <Sidebar />
            <main className="flex-1 flex flex-col min-w-0 min-h-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden relative pb-16 lg:pb-0">
              {children}
            </main>
            <SocialPanel />
          </div>
          <ActiveGameBanner />
          <BottomNav />
        </DashboardNotificationsProvider>
      </GameProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
