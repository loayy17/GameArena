"use client";
import { useAuth } from "@/app/AuthProvider";
import { useTranslation } from "@/Hooks/useTranslation";
import { useDashboardNotifications } from "@/app/(dashboard)/DashboardNotificationsProvider";
import { LogOut, Hexagon, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ar } from "./i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "./i18n/SideBar/en.i18n";
import { authService } from "@/services/def/AuthService";
import { TBadge } from "./common/TBadge";
import { TTile } from "./common/TTile";
import { navItems } from "@/types";
import { LangTheme } from "./common/LangTheme";
import { TButton } from "./common/TButton";

function Sidebar() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const { friendRequestCount, unreadMessageCount } =
    useDashboardNotifications();

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
  const isActive = (id: string) => {
    if (id === "home") return pathname === "/home";
    return pathname.startsWith(`/${id}`);
  };

  return (
    <aside
      className={`shrink-0 bg-bg-sidebar border-r border-border flex flex-col h-full ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Logo / Toggle */}
      <div className="flex items-center h-16 px-4 border-b border-border">
        {collapsed ? (
          <TButton
            onClick={() => setCollapsed(false)}
            className="mx-auto text-text-secondary hover:text-text cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </TButton>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-neon-magenta flex items-center justify-center">
                <Hexagon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">
                Game<span className="text-neon-cyan">Arena</span>
              </span>
            </div>
            <TButton
              onClick={() => setCollapsed(true)}
              className="text-text-secondary hover:text-text cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </TButton>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 px-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {navItems.map(({ id, labelKey, icon: Icon, badge }) => {
          const active = isActive(id);
          const badgeCount =
            badge === "friends"
              ? friendRequestCount
              : badge === "messages"
                ? unreadMessageCount
                : 0;

          return (
            <Link
              key={id}
              href={`/${id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                collapsed ? "justify-center" : ""
              } ${
                active
                  ? "bg-primary/15 text-white"
                  : "text-text-secondary hover:bg-surface-alt hover:text-text"
              }`}
            >
              <Icon size={20} />
              {!collapsed && (
                <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                  <span className="truncate">
                    {t[labelKey as keyof TSidebarTranslation]}
                  </span>
                  {badgeCount > 0 && <TBadge count={badgeCount} />}
                </span>
              )}
              {collapsed && badgeCount > 0 && (
                <span className="absolute right-2 top-2">
                  <TBadge count={badgeCount} />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`px-3 mb-2 ${collapsed ? "flex justify-center" : ""}`}>
        <TButton
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-error-bg hover:text-error transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span>{t.logout}</span>}
        </TButton>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="relative shrink-0">
            {user && <TTile user={user} size="sm" />}
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-neon-green border-2 border-bg-sidebar" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text truncate">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <p className="text-xs text-neon-cyan">{user?.userName}</p>
            </div>
          )}
        </div>
      </div>
      <LangTheme collapsed={collapsed} />
    </aside>
  );
}

export { Sidebar };
