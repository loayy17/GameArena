"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { useAuth } from "@/app/providers/AuthProvider";
import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { GIcon } from "@/component/common/GIcon";
import { GBadge } from "@/component/common/GBadge";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { UserRoleEnum } from "@/domain/enum/UserRoleEnum";
import { navGroupOrder, sidebarNav } from "@/domain/constant/sidebarNav";
import { ar } from "@/component/i18n/SideBar/ar.i18n";
import { fr } from "@/component/i18n/SideBar/fr.i18n";
import { en } from "@/component/i18n/SideBar/en.i18n";
import { useNotificationList } from "./useNotificationList";
import { useTranslation } from "./useSetting";

import type { TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import type { TNavGroup } from "@/domain/constant/sidebarNav";
import type { INavSection } from "@/component/common/def/GNav";

function useNavItems() {
  const pathname = usePathname();
  const t = useTranslation<TSidebarTranslation>({ en, ar, fr });
  const { user } = useAuth();
  const { friendRequestCount, unreadMessageCount } = useDashboardData();
  const { unreadCount: alertCount } = useNotificationList("all");
  const isStaff = user?.role === UserRoleEnum.Admin || user?.role === UserRoleEnum.Moderator || user?.role === UserRoleEnum.SuperAdmin;

  const { navItems, pageTitle } = useMemo(() => {
    const badges = {
      friends: friendRequestCount,
      messages: unreadMessageCount,
      invites: alertCount,
    };
    const visible = sidebarNav.filter((item) => item.id !== "admin" || isStaff);
    const matched = visible.filter((item) => pathname.startsWith(`/${item.id}`)).sort((a, b) => b.id.length - a.id.length)[0];
    const activeId = matched?.id ?? "home";

    return {
      pageTitle: matched ? `${t[matched.labelKey as keyof TSidebarTranslation]}` : undefined,
      navItems: visible.map((item) => ({
        id: item.id,
        label: t[item.labelKey as keyof TSidebarTranslation],
        icon: <GIcon icon={item.icon} size={SizeEnum.md} />,
        badge: item.badge ? <GBadge count={badges[item.badge as keyof typeof badges] ?? 0} className="h-4 min-w-4" /> : undefined,
        active: item.id === activeId,
        href: `/${item.id}`,
      })),
    };
  }, [pathname, t, friendRequestCount, unreadMessageCount, alertCount, isStaff]);

  const sections = useMemo<INavSection[]>(() => {
    const groupLabels: Record<TNavGroup, string> = {
      main: t.groupMain,
      social: t.groupSocial,
      competition: t.groupCompetition,
      account: t.groupAccount,
      administration: t.groupAdministration,
    };

    return navGroupOrder
      .map((group) => ({
        id: group,
        label: groupLabels[group],
        items: navItems.filter((item) => sidebarNav.find((entry) => entry.id === item.id)?.group === group),
      }))
      .filter((section) => section.items.length > 0);
  }, [navItems, t]);

  return { t, navItems, sections, pageTitle };
}

export { useNavItems };
