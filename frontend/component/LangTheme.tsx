"use client";

import { Globe, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { en, type TLangThemeTranslation } from "@/component/i18n/LangTheme/en.i18n";
import { ar } from "@/component/i18n/LangTheme/ar.i18n";
import { GIcon } from "./common/GIcon";
import { GButton } from "./common/GButton";

function LangTheme({ collapsed, className = "" }: { collapsed: boolean; className?: string }) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar }) as TLangThemeTranslation;

  const isDark = theme === "dark";
  const sizeClass = collapsed ? "h-10 w-10 min-w-10" : "flex-1 w-full";

  const toggleBtn = clsx(
    "flex items-center justify-center gap-2 text-xs font-semibold border border-border text-text-secondary bg-surface",
    "rounded-[var(--radius-sm)] transition-colors duration-150",
    "hover:text-primary hover:border-primary/40",
    sizeClass,
  );

  return (
    <div className={clsx(" flex items-center justify-center gap-2", collapsed ? "flex-col" : "w-full", className)}>
      <GButton
        variant="ghost"
        onClick={() => setLocale(locale === "en" ? "ar" : "en")}
        title={locale === "en" ? t.switchToArabic : t.switchToEnglish}
        className={toggleBtn}>
        <GIcon icon={Globe} size="sm" color="inherit" />
        {!collapsed && <span>{locale === "en" ? t.english : t.arabic}</span>}
      </GButton>

      <GButton
        variant="ghost"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? t.switchToLight : t.switchToDark}
        className={toggleBtn}>
        <GIcon icon={isDark ? Moon : Sun} size="sm" color="primary" />
        {!collapsed && <span>{isDark ? t.light : t.dark}</span>}
      </GButton>
    </div>
  );
}

export { LangTheme };
