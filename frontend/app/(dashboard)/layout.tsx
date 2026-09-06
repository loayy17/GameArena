"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { useAuth } from "@/app/providers/AuthProvider";
import { SocialPanel } from "@/component/social/SocialPanel";
import { ConnectionProvider } from "@/app/providers/ConnectionProvider";
import { GameProvider } from "@/app/providers/GameProvider";
import { DashboardDataProvider } from "@/app/providers/DashboardDataProvider";
import { ActiveGameBanner } from "@/component/games/ActiveGameBanner";
import { NotificationPopup } from "@/component/notification/NotificationPopup";
import { GSpinner } from "@/component/common/GSpinner";
import { GNav } from "@/component/common/GNav";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { Sidebar } from "@/component/Sidebar/Sidebar";
import { Header } from "@/component/Header/Header";
import { useAside } from "@/hooks/useAside";
import { useNavItems } from "@/hooks/useNavItems";

import type { IDashboardLayoutProps } from "./def/DashboardLayout";

function MobileFooter() {
  const { t, navItems } = useNavItems();

  const items = navItems
    .filter((item) => item.mobile !== false)
    .map((item) => ({
      ...item,
      label: item.id === "history" ? t.historyShort : item.label,
    }));

  return (
    <GNav
      className="md:hidden gap-1 border-t border-border/50 bg-bg-sidebar/80 px-1.5 pt-1.5 pb-safe-only backdrop-blur-md"
      aria-label={t.mainNavigation}
      items={items}
      orientation={NavOrientationEnum.Horizontal}
      stacked
    />
  );
}

function DashboardLayout({ children }: IDashboardLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const redirectedRef = useRef(false);
  const sidebarAside = useAside(false, "sidebarCollapsed");
  const socialAside = useAside(true);

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
            <Header sidebar={sidebarAside} social={socialAside} />
            <div className="flex min-h-0 flex-1 pt-14">
              <Sidebar aside={sidebarAside} />
              <main className="flex flex-1 flex-col overflow-y-auto custom-scrollbar sm:pb-mobile-nav md:pb-0">{children}</main>
              <SocialPanel aside={socialAside} />
            </div>
            <MobileFooter />
          </div>
          <NotificationPopup />
          <ActiveGameBanner />
        </DashboardDataProvider>
      </GameProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
