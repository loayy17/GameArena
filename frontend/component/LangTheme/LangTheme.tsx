"use client";

import { Globe, Moon, Sun } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/cn";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { en } from "@/component/i18n/LangTheme/en.i18n";
import { ar } from "@/component/i18n/LangTheme/ar.i18n";
import { fr } from "@/component/i18n/LangTheme/fr.i18n";
import { GIcon } from "@/component/common/GIcon";
import { GButton } from "@/component/common/GButton";
import { GDropdown } from "@/component/common/GDropdown";
import { GLocalePickerItems } from "@/component/common/GLocalePickerItems";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { AccentColorEnum } from "@/domain/enum/AccentColorEnum";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";

import type { TLangThemeTranslation } from "@/component/i18n/LangTheme/en.i18n";
import type { ILangThemeProps } from "./def/LangTheme";

function LangTheme({ collapsed = false, variant = "compact", size = SizeEnum.md, align = "end", className, fill }: ILangThemeProps) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation<TLangThemeTranslation>({ en, ar, fr });
  const [open, setOpen] = useState(false);

  const isDark = theme === ThemeEnum.Dark;
  const localeName = locale === LocaleEnum.Fr ? t.french : locale === LocaleEnum.Ar ? t.arabic : t.english;
  const effectiveEqual = (fill || variant === "equal") && !collapsed;

  const containerClass = cn(
    collapsed ? "flex flex-col items-center gap-2" : effectiveEqual ? "grid w-full grid-cols-2 gap-2" : "flex items-center gap-2",
    className,
  );

  const buttonSize = collapsed ? SizeEnum.icon : size;
  const tooltipSide = collapsed ? "end" : undefined;
  const stretchClass = cn("rounded-md", effectiveEqual && "w-full");

  return (
    <div className={containerClass}>
      <GDropdown
        open={open}
        onClose={() => setOpen(false)}
        align={align}
        triggerClassName={effectiveEqual ? "w-full" : undefined}
        trigger={
          <GButton
            variant={ButtonVariantEnum.Secondary}
            size={buttonSize}
            className={stretchClass}
            title={t.languages}
            aria-label={collapsed ? t.languages : undefined}
            tooltipPosition={tooltipSide}
            onClick={() => setOpen((prev) => !prev)}>
            <GIcon icon={Globe} size={SizeEnum.md} />
            {!collapsed && <span className="truncate">{localeName}</span>}
          </GButton>
        }>
        <GLocalePickerItems
          locale={locale}
          labels={{ [LocaleEnum.En]: t.english, [LocaleEnum.Ar]: t.arabic, [LocaleEnum.Fr]: t.french }}
          onSelect={(value) => {
            setLocale(value);
            setOpen(false);
          }}
        />
      </GDropdown>

      <GButton
        variant={ButtonVariantEnum.Secondary}
        size={buttonSize}
        className={stretchClass}
        title={isDark ? t.switchToLight : t.switchToDark}
        aria-label={collapsed ? (isDark ? t.switchToLight : t.switchToDark) : undefined}
        tooltipPosition={tooltipSide}
        onClick={() => setTheme(isDark ? ThemeEnum.Light : ThemeEnum.Dark)}>
        <GIcon icon={isDark ? Moon : Sun} size={SizeEnum.md} color={AccentColorEnum.Primary} />
        {!collapsed && <span className="truncate">{isDark ? t.light : t.dark}</span>}
      </GButton>
    </div>
  );
}

export { LangTheme };
