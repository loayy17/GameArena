"use client";

import { useMemo } from "react";
import { PanelLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAside } from "@/hooks/useAside";
import { useNavigation } from "@/hooks/useNavigation";
import { useNavBadges } from "@/hooks/useNavBadges";
import { GIcon } from "@/component/common/GIcon";
import { GBadge } from "@/component/common/GBadge";
import { GNav } from "@/component/common/GNav";
import type { IGNavItem } from "@/component/common/def/GNav";
import { GModal } from "@/component/common/GModal";
import { BrandMark } from "@/component/common/BrandMark";
import { AsideWrapper } from "@/component/aside/AsideWrapper";
import { AsideHeader } from "@/component/aside/AsideHeader";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { SidebarFooter } from "./SidebarFooter";
import type { IAsideConfig } from "@/component/aside/AsideTypes";
import type { ISidebarProps } from "./def/Sidebar";

function SidebarNavSections({
  primaryItems,
  secondaryItems,
  collapsed,
}: {
  primaryItems: IGNavItem[];
  secondaryItems: IGNavItem[];
  collapsed?: boolean;
}) {
  return (
    <div className="flex flex-col gap-5">
      <GNav items={primaryItems} orientation={NavOrientationEnum.Vertical} collapsed={collapsed} />
      <GNav items={secondaryItems} orientation={NavOrientationEnum.Vertical} collapsed={collapsed} className="border-t border-border/40 pt-4" />
    </div>
  );
}

function Sidebar({ aside: asideProp }: ISidebarProps) {
  const router = useRouter();
  const { activeId, t, sidebarNav } = useNavigation();
  const asideDefault = useAside(true);
  const aside = asideProp ?? asideDefault;
  const { collapsed, open, closeMobile, expand, collapse } = aside;
  const navBadges = useNavBadges();

  const navItems = useMemo<IGNavItem[]>(
    () =>
      sidebarNav.map(({ id, labelKey, icon: Icon, badge }) => {
        const count = badge ? navBadges[badge as keyof typeof navBadges] : 0;
        const active = activeId === id;
        return {
          id,
          icon: <GIcon icon={Icon} size={SizeEnum.md} />,
          label: t[labelKey as keyof typeof t],
          active,
          onClick: () => {
            router.push(`/${id}`);
            closeMobile();
          },
          badge:
            count > 0 ? (
              <GBadge
                variant={AccentColorEnum.Danger}
                size={SizeEnum.sm}
                className={active ? "min-w-5 justify-center bg-primary text-primary-muted" : "min-w-5 justify-center"}>
                {count}
              </GBadge>
            ) : undefined,
        };
      }),
    [t, activeId, router, closeMobile, navBadges, sidebarNav],
  );

  const { primaryItems, secondaryItems } = useMemo(() => {
    const primary: IGNavItem[] = [];
    const secondary: IGNavItem[] = [];
    navItems.forEach((item, index) => {
      (sidebarNav[index]?.mobile === false ? secondary : primary).push(item);
    });
    return { primaryItems: primary, secondaryItems: secondary };
  }, [navItems, sidebarNav]);

  const asideConfig: IAsideConfig = {
    expandedWidth: "w-64",
    collapsedWidth: "w-16",
    label: t.mainNavigation,
  };

  const brand = <BrandMark name={t.brand} />;

  return (
    <>
      {/* Laptop (xl+): real layout column */}
      <div className="hidden xl:flex">
        <AsideWrapper config={asideConfig} collapsed={collapsed} footer={<SidebarFooter collapsed={collapsed} closeMobile={closeMobile} />}>
          <div className="px-3 py-4">
            <SidebarNavSections primaryItems={primaryItems} secondaryItems={secondaryItems} collapsed={collapsed} />
          </div>
        </AsideWrapper>
      </div>

      <GModal className="hidden md:block xl:hidden" open={open} onClose={closeMobile} side="start" ariaLabel={t.mainNavigation}>
        <AsideHeader
          overlay
          collapsed={collapsed}
          expand={expand}
          collapse={collapse}
          closeMobile={closeMobile}
          label={t.mainNavigation}
          collapsedIcon={<GIcon icon={PanelLeft} size={SizeEnum.md} />}
          brand={brand}
        />
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-3 py-4">
          <SidebarNavSections primaryItems={primaryItems} secondaryItems={secondaryItems} />
        </div>
        <SidebarFooter collapsed={false} closeMobile={closeMobile} />
      </GModal>
    </>
  );
}

export { Sidebar };
