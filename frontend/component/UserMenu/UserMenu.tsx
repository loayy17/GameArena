"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bug,
  ChevronDown,
  ChevronRight,
  Circle,
  CircleCheck,
  CircleHelp,
  FileText,
  Globe,
  LogOut,
  Moon,
  Scale,
  Settings,
  Sun,
  User,
} from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/useLogout";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { GAvatar } from "@/component/common/GAvatar";
import { GButton } from "@/component/common/GButton";
import { GDropdown } from "@/component/common/GDropdown";
import { GDropdownItem } from "@/component/common/GDropdownItem";
import { GIcon } from "@/component/common/GIcon";
import { GUserInfo } from "@/component/common/GUserInfo";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { ar } from "@/component/i18n/UserMenu/ar.i18n";
import { en, type TUserMenuTranslation } from "@/component/i18n/UserMenu/en.i18n";
import { fr } from "@/component/i18n/UserMenu/fr.i18n";

function localeName(locale: LocaleEnum, t: TUserMenuTranslation): string {
  switch (locale) {
    case LocaleEnum.Ar:
      return t.arabic;
    case LocaleEnum.Fr:
      return t.french;
    default:
      return t.english;
  }
}

function UserMenu() {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();

  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar, fr }) as TUserMenuTranslation;

  const [open, setOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const closeMenu = () => {
    setNestedOpen(false);
    setHelpOpen(false);
    setOpen(false);
  };

  const toggleMenu = () => {
    setOpen((current) => !current);
    setNestedOpen(false);
    setHelpOpen(false);
  };

  const handleTheme = () => {
    setTheme(theme === ThemeEnum.Dark ? ThemeEnum.Light : ThemeEnum.Dark);
    closeMenu();
  };

  const handleLocale = (nextLocale: LocaleEnum) => {
    setLocale(nextLocale);
    closeMenu();
  };

  const handleSettings = () => {
    closeMenu();
    router.push("/settings");
  };

  const handleProfile = () => {
    closeMenu();
    if (user?.id) router.push(`/profile/${user.id}`);
  };

  const handlePage = (path: string) => {
    closeMenu();
    router.push(path);
  };

  const handleReportBug = () => {
    closeMenu();
    window.location.href = "mailto:hindiloay01@gmail.com?subject=GameArena%20Bug%20Report";
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  const renderLocaleItem = (localeValue: LocaleEnum, label: string) => (
    <GDropdownItem label={label} disabled={locale === localeValue} onClick={() => handleLocale(localeValue)}>
      <GIcon icon={locale === localeValue ? CircleCheck : Circle} className="shrink-0" />
    </GDropdownItem>
  );

  return (
    <GDropdown
      open={open}
      onClose={closeMenu}
      align="end"
      trigger={
        <GButton
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.md}
          rounded={SizeEnum.full}
          aria-label={t.userMenu}
          aria-expanded={open}
          aria-haspopup="menu"
          onClick={toggleMenu}>
          <div className="flex items-center gap-2">
            <GAvatar firstName={user?.firstName} lastName={user?.lastName} avatarUrl={user?.avatarUrl} status={user?.status} size={SizeEnum.xs} />
            <span className="hidden max-w-32 truncate text-sm font-medium text-text sm:inline-block">
              {user?.firstName} {user?.lastName}
            </span>
            <GIcon icon={ChevronDown} size={SizeEnum.xs} className="shrink-0 text-text-muted" />
          </div>
        </GButton>
      }>
      <div className="border-b border-border p-2">
        <GUserInfo
          firstName={user?.firstName}
          lastName={user?.lastName}
          userName={user?.userName}
          avatarUrl={user?.avatarUrl}
          status={user?.status}
          avatarSize={SizeEnum.xs}
        />
      </div>

      <GDropdownItem icon={User} label={t.profile} onClick={handleProfile} />
      <GDropdownItem icon={theme === ThemeEnum.Dark ? Sun : Moon} label={theme === ThemeEnum.Dark ? t.light : t.dark} onClick={handleTheme} />
      <GDropdown
        open={nestedOpen && open}
        onClose={() => setNestedOpen(false)}
        align="left"
        trigger={
          <GDropdownItem
            icon={Globe}
            className="w-full"
            label={`${t.language}: ${localeName(locale, t)}`}
            onClick={() => {
              setNestedOpen((current) => !current);
              setHelpOpen(false);
            }}>
            <GIcon icon={ChevronRight} size={SizeEnum.xs} />
          </GDropdownItem>
        }>
        {renderLocaleItem(LocaleEnum.En, t.english)}
        {renderLocaleItem(LocaleEnum.Ar, t.arabic)}
        {renderLocaleItem(LocaleEnum.Fr, t.french)}
      </GDropdown>

      <GDropdown
        open={helpOpen && open}
        onClose={() => setHelpOpen(false)}
        align="left"
        trigger={
          <GDropdownItem
            icon={CircleHelp}
            className="w-full"
            label={t.help}
            onClick={() => {
              setHelpOpen((current) => !current);
              setNestedOpen(false);
            }}>
            <GIcon icon={ChevronRight} size={SizeEnum.xs} />
          </GDropdownItem>
        }>
        <GDropdownItem icon={Bug} label={t.reportBug} onClick={handleReportBug} />
        <GDropdownItem icon={Activity} label={t.healthServices} onClick={() => handlePage("/health")} />
        <GDropdownItem icon={FileText} label={t.privacyPolicy} onClick={() => handlePage("/privacy")} />
        <GDropdownItem icon={Scale} label={t.termsOfService} onClick={() => handlePage("/terms")} />
      </GDropdown>
      <GDropdownItem icon={Settings} label={t.settings} onClick={handleSettings} />
      <GDropdownItem icon={LogOut} label={t.logout} className="text-danger" onClick={handleLogout} />
    </GDropdown>
  );
}

export { UserMenu };
