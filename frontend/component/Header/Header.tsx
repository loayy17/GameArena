"use client";

import { Menu, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useNavItems } from "@/hooks/useNavItems";
import { GBrandMark } from "@/component/common/GBrandMark";
import { GButton } from "@/component/common/GButton";
import { UserMenu } from "@/component/user/UserMenu";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import type { UseAsideReturn } from "@/hooks/useAside";

function Header({ sidebar }: { sidebar?: UseAsideReturn }) {
  const { t } = useNavItems();
  return (
    <header className="fixed inset-x-0 top-0 z-sticky flex h-14 items-center gap-2 border-b border-border/50 bg-bg-sidebar/80 px-1 backdrop-blur-md">
      <GButton
        icon={Menu}
        label={t.mainNavigation}
        variant={ButtonVariantEnum.Subtle}
        size={SizeEnum.icon}
        className="hidden md:inline-flex xl:hidden"
        tooltipSide="end"
        aria-expanded={sidebar?.open}
        onClick={() => sidebar?.toggleMobile()}
      />
      <GButton
        icon={sidebar && !sidebar.collapsed ? PanelLeftClose : PanelLeftOpen}
        label={t.mainNavigation}
        variant={ButtonVariantEnum.Subtle}
        size={SizeEnum.icon}
        className="hidden xl:inline-flex"
        tooltipSide="end"
        aria-pressed={sidebar ? !sidebar.collapsed : undefined}
        onClick={() => sidebar?.toggleCollapsed()}
      />

      <div className="min-w-0 flex-1">
        <GBrandMark name={t.brand} href="/home" />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <UserMenu />
      </div>
    </header>
  );
}

export { Header };
