"use client";

import { Menu, UsersRound } from "lucide-react";

import { useDashboardData } from "@/app/providers/DashboardDataProvider";
import { useTranslation } from "@/hooks/useSetting";

import { BrandMark } from "@/component/common/BrandMark";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { UserMenu } from "@/component/UserMenu/UserMenu";

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
    <header className="fixed inset-x-0 top-0 z-sticky flex h-14 items-center gap-2 border-b border-border/60 bg-bg-sidebar/80 backdrop-blur-md px-3">
      <GButton
        variant={ButtonVariantEnum.Subtle}
        size={SizeEnum.icon}
        rounded={SizeEnum.full}
        className={sidebar?.open ? "hidden md:inline-flex xl:hidden bg-primary-muted text-primary" : "hidden md:inline-flex xl:hidden"}
        aria-label={t.mainNavigation}
        aria-expanded={sidebar?.open}
        onClick={() => sidebar?.toggleMobile()}>
        <GIcon icon={Menu} size={SizeEnum.md} />
      </GButton>
      <GButton
        variant={ButtonVariantEnum.Subtle}
        size={SizeEnum.icon}
        rounded={SizeEnum.full}
        className={sidebar && !sidebar.collapsed ? "hidden xl:inline-flex bg-primary-muted text-primary" : "hidden xl:inline-flex"}
        aria-label={t.mainNavigation}
        aria-expanded={sidebar ? !sidebar.collapsed : undefined}
        onClick={() => sidebar?.toggleCollapsed()}>
        <GIcon icon={Menu} size={SizeEnum.md} />
      </GButton>

      <div className="min-w-0 flex-1">
        <BrandMark name={t.brand} onClick={() => router.push("/")} />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <UserMenu />
        {/* Social: drawer on <xl */}
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          rounded={SizeEnum.full}
          className={social?.open ? "relative inline-flex xl:hidden bg-primary-muted text-primary" : "relative inline-flex xl:hidden"}
          aria-label={st.friendsAndInvites}
          aria-expanded={social?.open}
          onClick={() => social?.toggleMobile()}>
          <GIcon icon={UsersRound} size={SizeEnum.md} />
          {socialBadge > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-2xs font-bold leading-none text-on-primary ring-2 ring-bg-sidebar">
              {socialBadge > 99 ? "99+" : socialBadge}
            </span>
          )}
        </GButton>
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          rounded={SizeEnum.full}
          className={social && !social.collapsed ? "relative hidden xl:inline-flex bg-primary-muted text-primary" : "relative hidden xl:inline-flex"}
          aria-label={st.friendsAndInvites}
          aria-expanded={social ? !social.collapsed : undefined}
          onClick={() => social?.toggleCollapsed()}>
          <GIcon icon={UsersRound} size={SizeEnum.md} />
          {socialBadge > 0 && (
            <span
              aria-hidden
              className="absolute -top-0.5 -end-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-2xs font-bold leading-none text-on-primary ring-2 ring-bg-sidebar">
              {socialBadge > 99 ? "99+" : socialBadge}
            </span>
          )}
        </GButton>
      </div>
    </header>
  );
}

export { Header };
