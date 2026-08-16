"use client";

import { Globe, Sun, Moon, CircleCheck, Circle } from "lucide-react";
import clsx from "clsx";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { en, type TLangThemeTranslation } from "@/component/i18n/LangTheme/en.i18n";
import { ar } from "@/component/i18n/LangTheme/ar.i18n";
import { fr } from "@/component/i18n/LangTheme/fr.i18n";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import type { ILangThemeProps } from "./def/LangTheme";
import { GDropdown } from "../common/GDropdown";
import { useState } from "react";
import { GDropdownItem } from "../common/GDropdownItem";

function LangTheme({ collapsed, className = "", align = "end" }: ILangThemeProps) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar, fr }) as TLangThemeTranslation;
  const isDark = theme === ThemeEnum.Dark;
  const [open, setOpen] = useState(false);
  const localeName = locale === LocaleEnum.Fr ? t.french : locale === LocaleEnum.Ar ? t.arabic : t.english;
  const renderLocaleItem = (localeValue: LocaleEnum, label: string) => (
    <GDropdownItem
      label={label}
      disabled={locale === localeValue}
      onClick={() => {
        setLocale(localeValue);
        setOpen(false);
      }}>
      <GIcon icon={locale === localeValue ? CircleCheck : Circle} className="shrink-0" />
    </GDropdownItem>
  );
  return (
    <div className={clsx("flex items-center justify-center gap-1 flex-1", collapsed ? "flex-col" : "w-full", className)}>
      <GDropdown
        open={open}
        onClose={() => setOpen(false)}
        align={align}
        trigger={
          <GButton
            variant={ButtonVariantEnum.Secondary}
            rounded={SizeEnum.sm}
            className={!collapsed ? "flex-1" : ""}
            title={t.languages}
            onClick={() => setOpen((prev) => !prev)}>
            <GIcon icon={Globe} size={SizeEnum.md} />
            {!collapsed && <span>{localeName}</span>}
          </GButton>
        }>
        {renderLocaleItem(LocaleEnum.En, t.english)}
        {renderLocaleItem(LocaleEnum.Ar, t.arabic)}
        {renderLocaleItem(LocaleEnum.Fr, t.french)}
      </GDropdown>
      <GButton
        variant={ButtonVariantEnum.Secondary}
        className={!collapsed ? "flex-1" : ""}
        rounded={SizeEnum.sm}
        title={isDark ? t.switchToLight : t.switchToDark}
        onClick={() => setTheme(isDark ? ThemeEnum.Light : ThemeEnum.Dark)}>
        <GIcon icon={isDark ? Moon : Sun} size={SizeEnum.md} color={AccentColorEnum.Primary} />
        {!collapsed && <span>{isDark ? t.light : t.dark}</span>}
      </GButton>
    </div>
  );
}

export { LangTheme };
