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
import { GNav, GNavItem } from "./common/GNav";
import { GButton } from "./common/GButton";
import { GBadge } from "./common/GBadge";
import { GStatusDot } from "./common/GStatusDot";
import { GIconTile } from "./common/GIconTile";
import { GIcon } from "./common/GIcon";
import { GCard } from "./common/GCard";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import clsx from "clsx";

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

  const activeId = sidebarNav.find((n) => pathname.startsWith(`/${n.id}`))?.id ?? "home";

  const navItems = useMemo(
    () =>
      sidebarNav.map(({ id, labelKey, icon: Icon, badge }) => ({
        id,
        icon: <Icon size={20} />,
        label: t[labelKey as keyof TSidebarTranslation],
        badgeCount:
          badge === "friends"
            ? friendRequestCount
            : badge === "messages"
              ? unreadMessageCount
              : 0,
      })),
    [t, friendRequestCount, unreadMessageCount],
  );

  const goTo = useCallback(
    (tabId: string) => {
      router.push(`/${tabId}`);
      if (isMobile) setCollapsed(true);
    },
    [router, isMobile],
  );

  const open = !collapsed;

  return (
    <>
      {isMobile && open && <GBackdrop onClick={() => setCollapsed(true)} />}

      <aside
        className={clsx(
          "relative flex shrink-0 bg-bg-sidebar border-e border-border flex-col h-dvh-safe lg:h-full",
          collapsed ? (isMobile ? "w-72" : "w-20") : "w-full sm:w-72",
          isMobile && [
            "fixed z-50 inset-y-0 start-0 lg:relative lg:z-auto lg:translate-x-0",
            collapsed
              ? "ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0"
              : "translate-x-0",
          ],
        )}
      >
        {!isMobile && (
          <GButton
            onClick={() => setCollapsed(!collapsed)}
            variant="secondary"
            size="icon"
            rounded="full"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="absolute -end-3 top-7"
          >
            {collapsed ? (
              locale === "ar" ? (
                <ChevronLeft size={14} />
              ) : (
                <ChevronRight size={14} />
              )
            ) : locale === "ar" ? (
              <ChevronRight size={14} />
            ) : (
              <ChevronLeft size={14} />
            )}
          </GButton>
        )}

        <div className="flex items-center h-20 px-4 border-b border-border shrink-0">
          <div
            className={clsx(
              "flex items-center w-full",
              collapsed ? "justify-center" : "justify-between",
            )}
          >
            <div className="flex items-center gap-3">
              <GIconTile gradient="brand" size="sm">
                <GIcon icon={Hexagon} size="md" color="inherit" className="text-text" />
              </GIconTile>
              {!collapsed && (
                <span className="font-bold text-text text-lg whitespace-nowrap">
                  Game<span className="text-primary">Arena</span>
                </span>
              )}
            </div>
            {isMobile && open && (
              <GButton
                onClick={() => setCollapsed(true)}
                variant="ghost"
                size="icon"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </GButton>
            )}
          </div>
        </div>

        <div className="flex-1 px-3 py-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <GNav orientation="vertical">
            {navItems.map((item) => {
              const active = activeId === item.id;
              return (
                <GNavItem
                  key={item.id}
                  active={active}
                  indicator="start"
                  collapsed={collapsed}
                  onClick={() => goTo(item.id)}
                  icon={item.icon}
                  label={item.label}
                  badge={
                    collapsed
                      ? item.badgeCount > 0
                        ? (
                          <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />
                        )
                        : undefined
                      : item.badgeCount > 0
                        ? (
                          <GBadge size="sm" className="ms-auto min-w-5 justify-center">
                            {item.badgeCount}
                          </GBadge>
                        )
                        : undefined
                  }
                />
              );
            })}
          </GNav>
        </div>

        <div className="mt-auto flex flex-col gap-2 p-3 border-t border-border pb-safe">
          <LangTheme collapsed={collapsed} />

          <GCard
            padding="sm"
            variant="outlined"
            className={clsx(
              collapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-3",
            )}
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
                <p className="text-xs text-text-secondary truncate">
                  @{user?.userName}
                </p>
              </div>
            )}

            <GButton
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              title={t.logout}
              aria-label={t.logout}
            >
              <LogOut size={18} />
            </GButton>
          </GCard>
        </div>
      </aside>

      {isMobile && collapsed && (
        <GButton
          onClick={() => setCollapsed(false)}
          variant="secondary"
          size="icon"
          fab
          className="bottom-4 start-4"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </GButton>
      )}
    </>
  );
}

export { Sidebar };
