"use client";

import { useRouter } from "next/navigation";
import { GNav } from "@/component/common/GNav";
import { GBadge } from "@/component/common/GBadge";
import { useNavigation } from "@/hooks/useNavigation";
import { useNavBadges } from "@/hooks/useNavBadges";
import { NavOrientationEnum } from "@/domain/enum/NavOrientationEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { iconSize } from "@/domain/constant/size-classes";

function MobileFooter() {
  const router = useRouter();
  const { activeId, t, sidebarNav } = useNavigation();
  const navBadges = useNavBadges();

  const navItems = sidebarNav
    .filter((n) => n.mobile !== false)
    .map(({ id, labelKey, icon: Icon, badge }) => {
      const count = badge ? navBadges[badge as keyof typeof navBadges] : 0;
      const active = activeId === id;
      return {
        id,
        icon: <Icon className={iconSize[SizeEnum.md]} />,
        label: t[labelKey as keyof typeof t],
        active,
        onClick: () => router.push(`/${id}`),
        badge:
          count > 0 ? (
            <GBadge
              variant={AccentColorEnum.Danger}
              size={SizeEnum.sm}
              className={active ? "min-w-4 px-1 justify-center bg-primary text-primary-muted" : "min-w-4 px-1 justify-center"}>
              {count > 99 ? "99+" : count}
            </GBadge>
          ) : undefined,
      };
    });

  return (
    <GNav
      className="md:hidden gap-0.5 border-t border-border/60 bg-bg-sidebar/95 px-2 pt-1.5 pb-safe-only backdrop-blur-md"
      aria-label={t.mainNavigation}
      items={navItems}
      orientation={NavOrientationEnum.Horizontal}
      stacked
    />
  );
}

export { MobileFooter };
