"use client";

import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { Hexagon, LogOut, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ar } from "./i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "./i18n/SideBar/en.i18n";
import { authService } from "@/services/def/AuthService";
import { GAside, useAsideCtx } from "./common/GAside";
import { GTile } from "./common/GTile";
import { LangTheme } from "./common/LangTheme";
import { GNav, GNavItem } from "./common/GNav";
import { GButton } from "./common/GButton";
import { GBadge } from "./common/GBadge";
import { GStatusDot } from "./common/GStatusDot";
import { GIconTile } from "./common/GIconTile";
import { GCard } from "./common/GCard";
import { UserStatusEnum } from "@/domain/enum/UserStatusEnum";
import { sidebarNav } from "@/domain/constant/sidebarNav";

function SidebarBrand() {
  return (
    <>
      <GIconTile gradient="bg-primary" size="sm" icon={Hexagon} />
      <span className="font-bold text-text text-lg whitespace-nowrap">
        Game<span className="text-primary">Arena</span>
      </span>
    </>
  );
}

/** Nav list — reads `collapsed` from context so it can render icon-only
 *  on the desktop rail without the parent having to pass anything down. */
function SidebarNav() {
  const { collapsed, isCompact, closeMobile } = useAsideCtx();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const { friendRequestCount, unreadMessageCount } = useDashboardNotifications();

  const activeId = sidebarNav.find((n) => pathname.startsWith(`/${n.id}`))?.id ?? "home";

  const navItems = useMemo(
    () =>
      sidebarNav.map(({ id, labelKey, icon: Icon, badge }) => ({
        id,
        icon: <Icon size={20} />,
        label: t[labelKey as keyof TSidebarTranslation],
        badgeCount: badge === "friends" ? friendRequestCount : badge === "messages" ? unreadMessageCount : 0,
      })),
    [t, friendRequestCount, unreadMessageCount],
  );

  const goTo = useCallback(
    (tabId: string) => {
      router.push(`/${tabId}`);
      if (isCompact) closeMobile();
    },
    [router, isCompact, closeMobile],
  );

  return (
    <div className="px-3 py-2">
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
                collapsed ? (
                  item.badgeCount > 0 ? (
                    <span className="absolute top-1 w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />
                  ) : undefined
                ) : item.badgeCount > 0 ? (
                  <GBadge size="sm" className="ms-auto min-w-5 justify-center">
                    {item.badgeCount}
                  </GBadge>
                ) : undefined
              }
            />
          );
        })}
      </GNav>
    </div>
  );
}

/** Footer — user card + logout, adapts to collapsed state via context */
function SidebarFooter() {
  const { collapsed } = useAsideCtx();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {
    } finally {
      setUser(null);
      router.replace("/login");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 pb-safe">
      <LangTheme collapsed={collapsed} />

      <GCard padding="sm" variant="outlined" className={collapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-3"}>
        <div className="relative shrink-0">
          {user && <GTile user={user} size="sm" />}
          <GStatusDot status={UserStatusEnum.Online} />
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-text-secondary truncate">@{user?.userName}</p>
          </div>
        )}

        <GButton onClick={handleLogout} variant="ghost" size="icon" title={t.logout} aria-label={t.logout}>
          <LogOut size={18} />
        </GButton>
      </GCard>
    </div>
  );
}

function Sidebar() {
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  return (
    <GAside
      side="start"
      widthExpanded="w-60"
      mode="inline"
      ariaLabel={t.mainNavigation}
      collapsedIcon={<Menu size={20} />}
      expandedBrand={<SidebarBrand />}
      footer={<SidebarFooter />}>
      <SidebarNav />
    </GAside>
  );
}

export { Sidebar };
