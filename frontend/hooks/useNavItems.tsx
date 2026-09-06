"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { GIcon } from "@/component/common/GIcon";
import { GBadge } from "@/component/common/GBadge";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { sidebarNav } from "@/domain/constant/sidebarNav";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { fr } from "@/component/i18n/SideBar/fr.i18n";
import { en } from "@/component/i18n/SideBar/en.i18n";

import { useNotificationList } from "./useNotificationList";
import { useTranslation } from "./useSetting";

import type { TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import type { IGNavItem } from "@/component/common/def/GNav";

function useNavItems() {
  const pathname = usePathname();
  const t = useTranslation<TSidebarTranslation>({ en, ar, fr });
  const { friendRequestCount, unreadMessageCount } = useDashboardData();
  const { unreadCount: alertCount } = useNotificationList("all");

  const navItems = useMemo<IGNavItem[]>(() => {
    const badges = {
      friends: friendRequestCount,
      messages: unreadMessageCount,
      invites: alertCount,
    };
    const activeId = sidebarNav.filter((item) => pathname.startsWith(`/${item.id}`)).sort((a, b) => b.id.length - a.id.length)[0]?.id ?? "home";

    return sidebarNav.map((item) => ({
      id: item.id,
      label: t[item.labelKey as keyof TSidebarTranslation],
      icon: <GIcon icon={item.icon} size={SizeEnum.md} />,
      badge: item.badge ? <GBadge count={badges[item.badge as keyof typeof badges] ?? 0} className="h-4 min-w-4" /> : undefined,
      active: item.id === activeId,
      mobile: item.mobile,
      href: `/${item.id}`,
    }));
  }, [pathname, t, friendRequestCount, unreadMessageCount, alertCount]);

  return { t, navItems };
}

export { useNavItems };
