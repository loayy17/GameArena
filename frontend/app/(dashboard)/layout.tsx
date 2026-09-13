"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/app/providers/AuthProvider";
import { ConnectionProvider } from "@/app/providers/ConnectionProvider";
import { GameProvider } from "@/app/providers/GameProvider";
import { DashboardDataProvider } from "@/app/providers/DashboardDataProvider";
import { ActiveGameBanner } from "@/component/games/ActiveGameBanner";
import { NotificationPopup } from "@/component/notification/NotificationPopup";
import { MobileTabNav } from "@/component/navigation/MobileTabNav";
import { GSpinner } from "@/component/common/GSpinner";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { Sidebar } from "@/component/Sidebar/Sidebar";
import { Header } from "@/component/Header/Header";
import { useAside } from "@/hooks/useAside";

import type { IDashboardLayoutProps } from "./def/DashboardLayout";

function DashboardLayout({ children }: IDashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const sidebarAside = useAside(false, "sidebarCollapsed");

  useEffect(() => {
    if (!loading && !user && !redirectedRef.current) {
      redirectedRef.current = true;
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full bg-bg items-center justify-center">
        <GSpinner size={SizeEnum.lg} />
      </div>
    );
  }

  return (
    <ConnectionProvider>
      <GameProvider>
        <DashboardDataProvider>
          <div className="flex h-viewport w-full flex-col bg-bg font-sans text-text antialiased">
            <Header sidebar={sidebarAside} />
            <div className="flex min-h-0 flex-1 pt-14">
              <Sidebar aside={sidebarAside} />
              <main className="flex flex-1 flex-col overflow-y-auto custom-scrollbar pb-mobile-nav md:pb-0">{children}</main>
            </div>
            <MobileTabNav />
          </div>
          <NotificationPopup />
          <ActiveGameBanner />
        </DashboardDataProvider>
      </GameProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
