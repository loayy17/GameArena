"use client";

import { useMemo } from "react";
import { LogOut, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/cn";
import { useAuth } from "@/app/providers/AuthProvider";
import { useAside } from "@/hooks/useAside";
import { useNavItems } from "@/hooks/useNavItems";
import { GAside } from "@/component/common/GAside";
import { GNav } from "@/component/common/GNav";
import { GModal } from "@/component/common/GModal";
import { GButton } from "@/component/common/GButton";
import { GBrandMark } from "@/component/common/GBrandMark";
import { GAvatar } from "@/component/common/GAvatar";
import { GUserRow } from "@/component/user/GUserRow";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import type { IGNavItem } from "@/component/common/def/GNav";
import type { ISidebarFooterProps, ISidebarNavSectionsProps, ISidebarProps } from "./def/Sidebar";

function SidebarFooter({ collapsed, closeMobile, t }: ISidebarFooterProps) {
  const router = useRouter();
  const { user } = useAuth();

  const logout = () => {
    router.push("/logout");
    closeMobile();
  };

  return (
    <div className={cn("flex flex-col gap-1.5 p-2 pb-safe", collapsed && "items-center")}>
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          {user && (
            <GButton
              variant={ButtonVariantEnum.Subtle}
              size={SizeEnum.icon}
              aria-label={t.profile}
              title={t.profile}
              tooltipPosition="end"
              onClick={() => {
                router.push(`/profile/${user.id}`);
                closeMobile();
              }}>
              <GAvatar user={user} size={SizeEnum.xs} />
            </GButton>
          )}
          <GButton icon={LogOut} label={t.logout} variant={ButtonVariantEnum.Subtle} size={SizeEnum.icon} tooltipSide="end" onClick={logout} />
        </div>
      ) : (
        user && (
          <GUserRow
            user={user}
            size={SizeEnum.xs}
            className="p-2"
            trailing={
              <GButton icon={LogOut} label={t.logout} variant={ButtonVariantEnum.Subtle} size={SizeEnum.icon} className="rounded-2xl" tooltipSide="top" onClick={logout} />
            }
          />
        )
      )}
    </div>
  );
}

function SidebarNavSections({ items, collapsed }: ISidebarNavSectionsProps) {
  return <GNav items={items} orientation={NavOrientationEnum.Vertical} collapsed={collapsed} />;
}

function Sidebar({ aside: asideProp }: ISidebarProps) {
  const { t, navItems } = useNavItems();
  const asideDefault = useAside(true);
  const aside = asideProp ?? asideDefault;
  const { open, closeMobile, collapsed } = aside;

  const items = useMemo<IGNavItem[]>(
    () =>
      navItems.map((item) => ({
        ...item,
        onClick: () => {
          closeMobile();
        },
      })),
    [navItems, closeMobile],
  );

  const label = t.mainNavigation;
  const footer = <SidebarFooter collapsed={collapsed} closeMobile={closeMobile} t={t} />;

  return (
    <>
      <div className="hidden xl:flex">
        <GAside label={label} className={cn("h-full border-border/50", collapsed ? "w-16" : "w-64")}>
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
            <SidebarNavSections items={items} collapsed={collapsed} />
          </div>
          <footer className="shrink-0 border-t border-border/60">{footer}</footer>
        </GAside>
      </div>

      <GModal className="hidden md:block xl:hidden" open={open} onClose={closeMobile} side="start" ariaLabel={label}>
        <header className="flex min-h-16 w-full shrink-0 items-center gap-2 border-b border-border px-3">
          <div className="min-w-0 flex-1">
            <GBrandMark name={t.brand} />
          </div>
          <GButton
            icon={X}
            label={`${t.close} ${label}`}
            variant={ButtonVariantEnum.Subtle}
            size={SizeEnum.icon}
            onClick={closeMobile}
            className="overflow-visible rounded-full"
          />
        </header>
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
          <SidebarNavSections items={items} />
        </div>
        <SidebarFooter collapsed={false} closeMobile={closeMobile} t={t} />
      </GModal>
    </>
  );
}

export { Sidebar };
