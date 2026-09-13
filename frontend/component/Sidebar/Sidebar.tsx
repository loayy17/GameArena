"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { useAside } from "@/hooks/useAside";
import { useNavItems } from "@/hooks/useNavItems";
import { sectionLabel } from "@/domain/constant/style-tokens";
import { GAside } from "@/component/common/GAside";
import { GNav } from "@/component/common/GNav";
import { GModal } from "@/component/common/GModal";
import { GButton } from "@/component/common/GButton";
import { GBrandMark } from "@/component/common/GBrandMark";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { INavSection } from "../common/def/GNav";
import type { ISidebarProps, ISidebarNavSectionsProps } from "./def/Sidebar";

function SidebarNavSections({ sections, collapsed }: ISidebarNavSectionsProps) {
  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <section key={section.id} aria-label={section.label}>
          {!collapsed && <p className={cn("px-3 pb-1.5", sectionLabel)}>{section.label}</p>}
          <GNav items={section.items} orientation={NavOrientationEnum.Vertical} collapsed={collapsed} />
        </section>
      ))}
    </div>
  );
}

function Sidebar({ aside: asideProp }: ISidebarProps) {
  const { t, sections } = useNavItems();
  const asideDefault = useAside(true);
  const aside = asideProp ?? asideDefault;
  const { open, closeMobile, collapsed } = aside;

  const labeledSections = useMemo<INavSection[]>(
    () =>
      sections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          onClick: () => {
            closeMobile();
          },
        })),
      })),
    [sections, closeMobile],
  );

  const label = t.mainNavigation;

  return (
    <>
      <div className="hidden xl:flex">
        <GAside label={label} className={cn("h-full border-border/50", collapsed ? "w-16" : "w-64")}>
          <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">
            <SidebarNavSections sections={labeledSections} collapsed={collapsed} />
          </div>
        </GAside>
      </div>

      <GModal className="hidden md:block xl:hidden" open={open} onClose={closeMobile} side="start" ariaLabel={label}>
        <header className="flex min-h-16 w-full shrink-0 items-center gap-2 border-b border-border px-3">
          <div className="min-w-0 flex-1">
            <GBrandMark name={t.brand} href="/home" onClick={closeMobile} />
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
          <SidebarNavSections sections={labeledSections} />
        </div>
      </GModal>
    </>
  );
}

export { Sidebar };
