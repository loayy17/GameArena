"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/component/SideBar";
import { SocialPanel } from "@/component/SocialPanel/SocialPanel";
import { ConnectionProvider } from "@/app/providers/ConnectionProvider";
import { DashboardNotificationsProvider } from "@/app/providers/DashboardNotificationsProvider";
import { GSpinner } from "@/component/common/GSpinner";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-screen bg-bg items-center justify-center">
        <GSpinner size="lg" />
      </div>
    );
  }

  return (
    <ConnectionProvider>
      <DashboardNotificationsProvider>
        <div className="flex h-screen w-screen bg-bg text-text overflow-hidden font-sans antialiased">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide relative">
            {children}
          </main>
          <SocialPanel />
        </div>
      </DashboardNotificationsProvider>
    </ConnectionProvider>
  );
}

export default DashboardLayout;
