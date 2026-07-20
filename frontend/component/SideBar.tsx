import { useAuth } from "@/app/providers/AuthProvider";
import { useTranslation } from "@/hooks/useSetting";
import { useDashboardNotifications } from "@/app/providers/DashboardNotificationsProvider";
import { Hexagon, LogOut, Menu, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import clsx from "clsx";
import { ar } from "./i18n/SideBar/ar.i18n";
import { en, type TSidebarTranslation } from "./i18n/SideBar/en.i18n";
import { authService } from "@/services/def/AuthService";
import { useConnections } from "@/app/providers/ConnectionProvider";
import { useAside } from "@/hooks/useAside";
import { GNav, type GNavItem } from "./common/GNav";
import { GButton } from "./common/GButton";
import { GBadge } from "./common/GBadge";
import { GCard } from "./common/GCard";
import { GIcon } from "./common/GIcon";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { GAvatar } from "./common/GAvatar";
import { GBackdrop } from "./common/GBackdrop";
import { LangTheme } from "./LangTheme";

function SidebarBrand() {
  return (
    <>
      <GIcon icon={Hexagon} size="sm" tile tileSize="sm" tileGradient="bg-primary" />
      <span className="font-bold text-text text-lg whitespace-nowrap">
        Game<span className="text-primary">Arena</span>
      </span>
    </>
  );
}

function SidebarNav() {
  const { collapsed, isCompact, closeMobile } = useAside();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const { friendRequestCount, unreadMessageCount, gameInvites, unreadNotificationCount } = useDashboardNotifications();

  const activeId = sidebarNav.find((n) => pathname.startsWith(`/${n.id}`))?.id ?? "home";

  const navItems = useMemo<GNavItem[]>(
    () =>
      sidebarNav
        .map(({ id, labelKey, icon: Icon, badge }) => ({
          id,
          icon: <GIcon icon={Icon} size="md" color="inherit" />,
          label: t[labelKey as keyof TSidebarTranslation],
          active: activeId === id,
          badgeCount:
            badge === "friends" ? friendRequestCount : badge === "messages" ? unreadMessageCount : badge === "invites" ? (gameInvites.length + unreadNotificationCount) : 0,
        }))
        .map((item) => ({
          ...item,
          collapsed,
          onClick: () => {
            router.push(`/${item.id}`);
            if (isCompact) closeMobile();
          },
          badge:
            item.badgeCount > 0 ? (
              collapsed ? (
                <span className="absolute top-1 inset-e-0 w-2 h-2 rounded-full bg-primary ring-2 ring-bg-sidebar" />
              ) : (
                <GBadge size="sm" className="ms-auto min-w-5 justify-center">
                  {item.badgeCount}
                </GBadge>
              )
            ) : undefined,
        })),
    [t, friendRequestCount, unreadMessageCount, gameInvites.length, activeId, collapsed, router, isCompact, closeMobile],
  );

  return (
    <div className="px-3 py-2">
      <GNav items={navItems} orientation="vertical" indicator="start" collapsed={collapsed} />
    </div>
  );
}

function SidebarFooter() {
  const { collapsed } = useAside();
  const { user, setUser } = useAuth();
  const { stopConnections } = useConnections();
  const router = useRouter();
  const t = useTranslation({ en, ar }) as TSidebarTranslation;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      await stopConnections();
      setUser(null);
      router.replace("/login");
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 pb-safe">
      <LangTheme collapsed={collapsed} />

      <GCard padding="sm" variant="outlined" className={collapsed ? "flex flex-col items-center gap-2" : "flex items-center gap-3"}>
        <div className="relative shrink-0">
          {user && <GAvatar firstName={user.firstName} lastName={user.lastName} status={user.status} size="sm" shape="circle" />}
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
          <GIcon icon={LogOut} size="md" color="inherit" />
        </GButton>
      </GCard>
    </div>
  );
}

function Sidebar() {
  const t = useTranslation({ en, ar }) as TSidebarTranslation;
  const aside = useAside(false);
  const { collapsed, open, isDesktop } = aside;

  const isInlineDesktop = isDesktop;
  const isOverlay = !isInlineDesktop;
  const showBackdrop = isOverlay && open;

  const asideClass = clsx(
    "flex flex-col shrink-0 h-dvh-safe bg-bg-sidebar transition-transform duration-200",
    "border-e border-border",
    isInlineDesktop
      ? collapsed
        ? "w-20"
        : "w-60"
      : [
          "fixed inset-y-0 z-50 start-0",
          open
            ? ["translate-x-0 shadow-2xl", "w-60"]
            : ["ltr:-translate-x-full rtl:translate-x-full", "w-0 overflow-hidden border-0 pointer-events-none"],
        ],
  );

  return (
    <>
      {showBackdrop && <GBackdrop onClick={aside.closeMobile} />}

      <aside
        className={asideClass}
        aria-label={t.mainNavigation}
        role={isOverlay ? "dialog" : undefined}
        aria-modal={isOverlay && open ? true : undefined}
        aria-hidden={isOverlay && !open ? true : undefined}>
        <header className="h-20 shrink-0 border-b border-border flex items-center px-4">
          <div className={clsx("flex items-center w-full gap-2", collapsed && isInlineDesktop && "justify-center")}>
            {collapsed && isInlineDesktop ? (
              <GButton variant="ghost" size="icon" onClick={aside.expand} aria-label={`Expand ${t.mainNavigation}`}>
                <GIcon icon={Menu} size="md" tile tileSize="md" />
              </GButton>
            ) : (
              <div className="flex-1 min-w-0 flex items-center gap-3">
                <SidebarBrand />
              </div>
            )}

            {isInlineDesktop && !collapsed && (
              <GButton variant="ghost" size="icon" onClick={aside.collapse} className="ms-auto" aria-label={`Collapse ${t.mainNavigation}`}>
                <X size={18} />
              </GButton>
            )}

            {isOverlay && open && (
              <GButton variant="ghost" size="icon" onClick={aside.closeMobile} className="ms-auto" aria-label={`Close ${t.mainNavigation}`}>
                <X size={20} />
              </GButton>
            )}
          </div>
        </header>

        {(isInlineDesktop || open) && (
          <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
            <SidebarNav />
          </main>
        )}

        {(isInlineDesktop || open) && (
          <footer className="border-t border-border">
            <SidebarFooter />
          </footer>
        )}
      </aside>

      {isOverlay && !open && (
        <GButton
          fab
          variant="secondary"
          size="icon"
          rounded="full"
          onClick={aside.openMobile}
          className="bottom-4 inset-s-4"
          aria-label={`Open ${t.mainNavigation}`}>
          <GIcon icon={Menu} size="md" tile tileSize="md" />
        </GButton>
      )}
    </>
  );
}

export { Sidebar };
