"use client";

import { Hexagon, Menu, Users } from "lucide-react";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useTranslation } from "@/hooks/useSetting";

import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GBadge } from "@/component/common/GBadge";
import { UserMenu } from "@/component/UserMenu/UserMenu";

import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";

import { ar as sideAr } from "@/component/i18n/SideBar/ar.i18n";
import { fr as sideFr } from "@/component/i18n/SideBar/fr.i18n";
import { en as sideEn, type TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import { ar as socialAr } from "@/component/i18n/SocialPanel/ar.i18n";
import { fr as socialFr } from "@/component/i18n/SocialPanel/fr.i18n";
import { en as socialEn, type TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import { useRouter } from "next/navigation";
import type { IHeaderProps } from "./def/Header";

function Header({ sidebar, social }: IHeaderProps) {
  const t = useTranslation({ en: sideEn, ar: sideAr, fr: sideFr }) as TSidebarTranslation;
  const st = useTranslation({ en: socialEn, ar: socialAr, fr: socialFr }) as TSocialPanelTranslation;
  const { friendRequestCount, unreadMessageCount, unreadNotificationCount, gameInvites } = useDashboardData();
  const router = useRouter();
  const socialBadge = friendRequestCount + unreadMessageCount + unreadNotificationCount + gameInvites.length;

  return (
    <header className="fixed inset-x-0 top-0 z-sticky flex h-14 items-center gap-2 border-b border-border bg-bg-sidebar px-3">
      <div className="hidden md:flex shrink-0">
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          rounded={SizeEnum.full}
          aria-label={t.mainNavigation}
          title={t.mainNavigation}
          aria-expanded={sidebar?.open || !sidebar?.collapsed}
          onClick={() => {
            sidebar?.toggleCollapsed();
            sidebar?.toggleMobile();
          }}>
          <GIcon icon={Menu} size={SizeEnum.md} />
        </GButton>
      </div>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        <GIcon icon={Hexagon} size={SizeEnum.sm} className="shrink-0" />
        <span className="truncate text-lg font-bold cursor-pointer" onClick={() => router.push("/")}>
          {t.brand}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <UserMenu />
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          rounded={SizeEnum.full}
          aria-label={st.friendsAndInvites}
          title={st.friendsAndInvites}
          className="shrink-0"
          onClick={() => {
            social?.toggleCollapsed();
            social?.toggleMobile();
          }}>
          <span className="relative inline-flex">
            <GIcon icon={Users} size={SizeEnum.md} />
            {socialBadge > 0 && (
              <span className="absolute -top-1 -inset-e-1">
                <GBadge variant={AccentColorEnum.Danger} size={SizeEnum.xs} className="min-w-4 justify-center px-1">
                  {socialBadge > 99 ? "99+" : socialBadge}
                </GBadge>
              </span>
            )}
          </span>
        </GButton>
      </div>
    </header>
  );
}

export { Header };
