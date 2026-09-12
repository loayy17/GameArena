"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bell,
  Bug,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  Globe,
  LogOut,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Scale,
  Settings,
  ShieldCheck,
  Sun,
  User,
  UsersRound,
} from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/useLogout";
import { useNotificationList } from "@/hooks/useNotificationList";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { cn } from "@/lib/cn";
import { GBrandMark } from "@/component/common/GBrandMark";
import { GButton } from "@/component/common/GButton";
import { GIcon } from "@/component/common/GIcon";
import { GBadge } from "@/component/common/GBadge";
import { GDropdown } from "@/component/common/GDropdown";
import { GMenuItem } from "@/component/common/GMenuItem";
import { GSwitch } from "@/component/common/GSwitch";
import { GAvatar } from "@/component/common/GAvatar";
import { GUserRow } from "@/component/user/GUserRow";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { UserRoleEnum } from "@/domain/enum/UserRoleEnum";
import { ar as sideAr } from "@/component/i18n/SideBar/ar.i18n";
import { fr as sideFr } from "@/component/i18n/SideBar/fr.i18n";
import { en as sideEn } from "@/component/i18n/SideBar/en.i18n";
import { ar as socialAr } from "@/component/i18n/SocialPanel/ar.i18n";
import { fr as socialFr } from "@/component/i18n/SocialPanel/fr.i18n";
import { en as socialEn } from "@/component/i18n/SocialPanel/en.i18n";
import { ar as menuAr } from "@/component/i18n/UserMenu/ar.i18n";
import { fr as menuFr } from "@/component/i18n/UserMenu/fr.i18n";
import { en as menuEn } from "@/component/i18n/UserMenu/en.i18n";

import type { TSidebarTranslation } from "@/component/i18n/SideBar/en.i18n";
import type { TSocialPanelTranslation } from "@/component/i18n/SocialPanel/en.i18n";
import type { TUserMenuTranslation } from "@/component/i18n/UserMenu/en.i18n";
import type { IHeaderProps } from "./def/Header";

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const BUG_REPORT_MAILTO = SUPPORT_EMAIL ? `mailto:${SUPPORT_EMAIL}?subject=GameArena%20Bug%20Report` : null;

const LOCALE_OPTIONS: { value: LocaleEnum; label: string }[] = [
  { value: LocaleEnum.En, label: "EN" },
  { value: LocaleEnum.Ar, label: "AR" },
  { value: LocaleEnum.Fr, label: "FR" },
];

function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();

  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation<TUserMenuTranslation>({ en: menuEn, ar: menuAr, fr: menuFr });

  const [open, setOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const isDark = theme === ThemeEnum.Dark;

  const closeMenu = () => {
    setHelpOpen(false);
    setOpen(false);
  };

  const goTo = (path: string) => {
    closeMenu();
    router.push(path);
  };

  const navigateDelayed = (path: string) => {
    setTimeout(() => {
      router.push(path);
      closeMenu();
    }, 10);
  };

  return (
    <GDropdown
      open={open}
      onClose={closeMenu}
      align="end"
      trigger={
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.md}
          aria-label={t.userMenu}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={() => {
            setOpen((current) => !current);
            setHelpOpen(false);
          }}
          className="rounded-full">
          <div className="flex items-center gap-2">
            <GAvatar user={user ?? {}} size={SizeEnum.xs} />
            <span className="hidden max-w-32 truncate text-sm font-medium text-text sm:inline-block">
              {user?.fullName?.trim() || user?.userName || ""}
            </span>
            <GIcon icon={ChevronDown} size={SizeEnum.xs} className="shrink-0 text-text-muted" />
          </div>
        </GButton>
      }>
      <div className="border-b border-border p-2">{user && <GUserRow user={user} size={SizeEnum.xs} />}</div>

      <div className="border-b border-border pb-2 pt-1.5">
        <div className="flex items-center justify-between gap-3 px-4 py-1.5">
          <span className="flex items-center gap-3 text-sm font-medium text-text">
            <GIcon icon={isDark ? Moon : Sun} size={SizeEnum.md} />
            {t.theme}
          </span>
          <GSwitch
            aria-label={isDark ? t.dark : t.light}
            checked={isDark}
            onChange={(e) => setTheme(e.target.checked ? ThemeEnum.Dark : ThemeEnum.Light)}
          />
        </div>

        <div className="px-4 pb-1 pt-1">
          <div className="flex items-center gap-3 pb-1.5 text-sm font-medium text-text">
            <GIcon icon={Globe} size={SizeEnum.md} />
            {t.language}
          </div>
          <div className="flex overflow-hidden rounded-lg border border-border bg-surface" role="group" aria-label={t.language}>
            {LOCALE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setLocale(opt.value)}
                aria-pressed={locale === opt.value}
                className={cn(
                  "flex-1 px-2 py-1.5 text-xs font-semibold transition-colors",
                  locale === opt.value ? "bg-primary text-on-primary" : "text-text-secondary hover:bg-primary-muted hover:text-primary",
                )}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-b border-border md:hidden">
        <p className="px-4 pb-1 pt-2 text-2xs font-semibold uppercase tracking-wider text-text-muted">{t.navigate}</p>
        <GMenuItem icon={Bell} label={t.notifications} onClick={() => goTo("/notifications")} />
        <GMenuItem icon={Settings} label={t.settings} onClick={() => goTo("/settings")} />
        {(user?.role === UserRoleEnum.Admin || user?.role === UserRoleEnum.Moderator || user?.role === UserRoleEnum.SuperAdmin) && (
          <GMenuItem icon={ShieldCheck} label={t.admin} onClick={() => goTo("/admin")} />
        )}
      </div>

      <GMenuItem icon={User} label={t.profile} onClick={() => user?.id && goTo(`/profile/${user.id}`)} />

      <GDropdown
        open={helpOpen && open}
        onClose={() => setHelpOpen(false)}
        align="left"
        trigger={
          <GMenuItem
            icon={CircleHelp}
            className="w-full"
            label={t.help}
            onClick={(e) => {
              e.stopPropagation();
              setHelpOpen((current) => !current);
            }}>
            <GIcon icon={ChevronRight} size={SizeEnum.xs} />
          </GMenuItem>
        }>
        {BUG_REPORT_MAILTO && (
          <GMenuItem
            icon={Bug}
            label={t.reportBug}
            onClick={() => {
              closeMenu();
              window.location.href = BUG_REPORT_MAILTO;
            }}
          />
        )}
        <GMenuItem icon={Activity} label={t.healthServices} onClick={() => navigateDelayed("/health")} />
        <GMenuItem icon={FileText} label={t.privacyPolicy} onClick={() => navigateDelayed("/privacy")} />
        <GMenuItem icon={Scale} label={t.termsOfService} onClick={() => navigateDelayed("/terms")} />
      </GDropdown>
      <GMenuItem
        icon={LogOut}
        label={t.logout}
        className="text-danger"
        onClick={() => {
          closeMenu();
          logout();
        }}
      />
    </GDropdown>
  );
}

function Header({ sidebar, social }: IHeaderProps) {
  const t = useTranslation<TSidebarTranslation>({ en: sideEn, ar: sideAr, fr: sideFr });
  const st = useTranslation<TSocialPanelTranslation>({ en: socialEn, ar: socialAr, fr: socialFr });
  const { unreadCount: socialBadgeTotal } = useNotificationList("all");
  const router = useRouter();

  const socialBadgeEl =
    socialBadgeTotal > 0 ? (
      <span aria-hidden className="absolute -top-1 -inset-e-1">
        <GBadge count={socialBadgeTotal} size={SizeEnum.xs} className="h-4 min-w-4 px-1 text-2xs ring-2 ring-bg-sidebar" />
      </span>
    ) : undefined;

  const iconToggle = (
    icon: typeof Menu,
    label: string,
    active: boolean,
    visibilityClass: string,
    onClick: () => void,
    state?: { expanded?: boolean; pressed?: boolean },
    tooltipSide: "start" | "end" = "end",
  ) => (
    <GButton
      icon={icon}
      label={label}
      variant={ButtonVariantEnum.Subtle}
      size={SizeEnum.icon}
      className={`${visibilityClass} ${active ? "bg-primary-muted text-primary" : ""}`}
      tooltipSide={tooltipSide}
      aria-expanded={state?.expanded}
      aria-pressed={state?.pressed}
      onClick={onClick}
    />
  );

  return (
    <header className="fixed inset-x-0 top-0 z-sticky flex h-14 items-center gap-2 border-b border-border/50 bg-bg-sidebar/80 px-3 backdrop-blur-md">
      <span className="relative hidden md:inline-flex xl:hidden">
        {iconToggle(Menu, t.mainNavigation, Boolean(sidebar?.open), "inline-flex", () => sidebar?.toggleMobile(), { expanded: sidebar?.open })}
      </span>
      <span className="relative hidden xl:inline-flex">
        {iconToggle(
          sidebar && !sidebar.collapsed ? PanelLeftClose : PanelLeftOpen,
          t.mainNavigation,
          Boolean(sidebar && !sidebar.collapsed),
          "inline-flex",
          () => sidebar?.toggleCollapsed(),
          { pressed: sidebar ? !sidebar.collapsed : undefined },
        )}
      </span>

      <div className="min-w-0 flex-1">
        <GBrandMark name={t.brand} onClick={() => router.push("/home")} />
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <UserMenu />
        <span className="relative inline-flex xl:hidden">
          {iconToggle(
            UsersRound,
            st.friendsAndInvites,
            Boolean(social?.open),
            "inline-flex",
            () => social?.toggleMobile(),
            { expanded: social?.open },
            "start",
          )}
          {socialBadgeEl}
        </span>
        <span className="relative hidden xl:inline-flex">
          {iconToggle(
            UsersRound,
            st.friendsAndInvites,
            Boolean(social && !social.collapsed),
            "inline-flex",
            () => social?.toggleCollapsed(),
            { pressed: social ? !social.collapsed : undefined },
            "start",
          )}
          {socialBadgeEl}
        </span>
      </div>
    </header>
  );
}

export { Header };
