"use client";
import { useAuth } from "@/app/AuthProvider";
import { useLocale, useTranslation } from "@/Hooks/useTranslation";
import {
  Home,
  Users,
  MessageSquare,
  Gamepad2,
  History,
  UserCircle,
  Settings,
  LogOut,
  Hexagon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ar from "./i18n/SideBar/ar.i18n";
import en, { TSidebarTranslation } from "./i18n/SideBar/en.i18n";
import { authApi } from "@/lib/auth.api";

const navItems = [
  { id: "home", labelKey: "home", icon: Home },
  { id: "friends", labelKey: "friends", icon: Users },
  { id: "messages", labelKey: "messages", icon: MessageSquare },
  { id: "games", labelKey: "games", icon: Gamepad2 },
  { id: "history", labelKey: "history", icon: History },
  { id: "profile", labelKey: "profile", icon: UserCircle },
  { id: "settings", labelKey: "settings", icon: Settings },
];

function Sidebar() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const pathname = usePathname();
  const [locale, setLocale] = useLocale();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null); // clear user state immediately
      router.replace("/login"); // navigate to login
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
          <button
            onClick={() => setCollapsed(false)}
            className="mx-auto text-text-secondary hover:text-text cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-neon-magenta flex items-center justify-center">
                <Hexagon className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">
                Game<span className="text-neon-cyan">Arena</span>
              </span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              className="text-text-secondary hover:text-text cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Language Toggle */}
      <div
        className={`px-3 pt-3 pb-1 ${collapsed ? "flex justify-center" : ""}`}
      >
        <button
          onClick={() => setLocale(locale === "en" ? "ar" : "en")}
          className={`flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
            collapsed ? "w-9 h-9" : "w-full"
          } ${
            locale === "en"
              ? "bg-surface border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan/60"
              : "bg-surface border-primary/30 text-primary hover:border-primary/60"
          }`}
        >
          {locale === "en" ? "AR" : "EN"}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-2 px-3 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {navItems.map(({ id, labelKey, icon: Icon }) => {
          const active = isActive(id);
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
                <span className="truncate">
                  {t[labelKey as keyof TSidebarTranslation]}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className={`px-3 mb-2 ${collapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-error-bg hover:text-error transition-colors ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} />
          {!collapsed && <span>{t.logout}</span>}
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <div
          className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}
        >
          <div className="relative shrink-0">
            <img
              src="https://i.pravatar.cc/150?img=3"
              alt={user?.firstName || "User"}
              className="w-9 h-9 rounded-lg object-cover"
            />
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
    </aside>
  );
}

export { Sidebar };
