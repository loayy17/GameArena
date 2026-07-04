"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLocale, useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import {
  LogOut,
  Hexagon,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { ar } from "./i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "./i18n/SideBar/en.i18n";
import { authService } from "@/services/def/AuthService";
import { GTile } from "./common/GTile";
import { LangTheme } from "./common/LangTheme";
import { GBackdrop } from "./common/GBackdrop";
import { GTabs } from "./common/GTabs";
import { GButton } from "./common/GButton";
import { GTabItem } from "./common/def/GTabs";
import { GStatusDot } from "./common/GStatusDot";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { sidebarNav } from "@/domain/constant/sidebarNav";

function Sidebar() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [locale] = useLocale();
  const pathname = usePathname();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const { friendRequestCount, unreadMessageCount } =
    useDashboardNotifications();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setCollapsed(mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  const activeTab = sidebarNav.find((n) => pathname.startsWith(`/${n.id}`))?.id;

  const handleTabChange = useCallback(
    (tabId: string) => {
      router.push(`/${tabId}`);
      if (isMobile) setCollapsed(true);
    },
    [router, isMobile],
  );

  const tabs = useMemo<GTabItem[]>(
    () =>
      sidebarNav.map(({ id, labelKey, icon: Icon, badge }) => ({
        id,
        icon: <Icon size={20} />,
        label: t[labelKey as keyof TSidebarTranslation],
        badge:
          badge === "friends"
            ? friendRequestCount
            : badge === "messages"
              ? unreadMessageCount
              : undefined,
      })),
    [t, friendRequestCount, unreadMessageCount],
  );

  const open = !collapsed;

  return (
    <>
      {isMobile && open && <GBackdrop onClick={() => setCollapsed(true)} />}

      <aside
        className={`relative flex shrink-0 bg-bg-sidebar border-r border-border flex-col h-dvh-safe lg:h-full transition-[width,transform] duration-300 ease-in-out shadow-2xl lg:shadow-none ${
          collapsed ? "w-20" : "w-full sm:w-72"
        } ${isMobile ? (collapsed ? "-translate-x-full fixed z-50" : "translate-x-0 fixed z-50") : "translate-x-0"}`}
      >
        {!isMobile && (
          <GButton
            onClick={() => setCollapsed(!collapsed)}
            variant="ghost"
            size="icon"
            className="absolute -right-3 bottom-24 w-6 h-6 flex items-center justify-center bg-surface-alt border border-border rounded-full text-text-secondary hover:text-text hover:border-primary transition-all shadow-md z-10"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </GButton>
        )}

        <div className="flex items-center h-20 px-4 border-b border-border/50 shrink-0">
          <div
            className={`flex items-center w-full ${collapsed ? "justify-center" : "justify-between"}`}
          >
            <div className="flex items-center gap-3">
              <div className="icon-tile w-10 h-10 bg-linear-to-br from-primary to-neon-magenta shadow-lg shadow-primary/20">
                <Hexagon className="w-5 h-5 text-text" />
              </div>
              {!collapsed && (
                <span className="font-bold text-text text-lg tracking-wide whitespace-nowrap">
                  Game<span className="text-neon-cyan">Arena</span>
                </span>
              )}
            </div>
            {isMobile && open && (
              <GButton
                onClick={() => setCollapsed(true)}
                variant="ghost"
                size="icon"
                className="p-2 text-text-secondary hover:text-text rounded-lg hover:bg-surface-alt"
              >
                <X size={20} />
              </GButton>
            )}
          </div>
        </div>

        <div className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto custom-scrollbar">
          <GTabs
            tabs={tabs}
            value={activeTab ?? "home"}
            onChange={handleTabChange}
            direction="V"
            variant="sidebar"
            fullWidth
            renderLabel={(tab) =>
              collapsed ? null : <span className="truncate">{tab.label}</span>
            }
          />
        </div>

        <div className="mt-auto flex flex-col gap-2 p-3 border-t border-border/50 pb-safe">
          <div className="px-1">
            <LangTheme collapsed={collapsed} />
          </div>

          <div
            className={`flex p-2 rounded-xl bg-surface/30 border border-border/50 ${
              collapsed ? "flex-col items-center gap-2" : "items-center gap-3"
            }`}
          >
            <div className="relative shrink-0">
              {user && <GTile user={user} size="sm" />}
              <GStatusDot status={UserStatusEnum.Online} />
            </div>

            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-neon-cyan font-medium truncate">
                  @{user?.userName}
                </p>
              </div>
            )}

            <GButton
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              title={t.logout}
              className="shrink-0 p-1.5 rounded-lg text-text-secondary hover:text-error hover:bg-error-bg transition-colors"
            >
              <LogOut size={18} />
            </GButton>
          </div>
        </div>
      </aside>

      {/* Mobile open button */}
      {isMobile && collapsed && (
        <GButton
          onClick={() => setCollapsed(false)}
          variant="secondary"
          size="icon"
          className={`fab top-4 ${locale === "en" ? "left-4" : "right-4"}`}
        >
          <Menu size={20} />
        </GButton>
      )}
    </>
  );
}

export { Sidebar };
