"use client";

import { Globe, Sun, Moon } from "lucide-react";
import { GButton } from "./GButton";
import clsx from "clsx";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { en, type TLangThemeTranslation } from "@/component/i18n/LangTheme/en.i18n";
import { ar } from "@/component/i18n/LangTheme/ar.i18n";

function LangTheme({
  collapsed,
  className = "",
}: {
  collapsed: boolean;
  className?: string;
}) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation({ en, ar }) as TLangThemeTranslation;

  const isDark = theme === "dark";
  const sizeClass = collapsed ? "w-10 h-10 min-w-10" : "flex-1 w-full";

  return (
    <div
      className={clsx(
        "p-3 flex items-center justify-center gap-2",
        collapsed ? "flex-col" : "w-full",
        className,
      )}
    >
      <GButton
        variant="secondary"
        onClick={() => setLocale(locale === "en" ? "ar" : "en")}
        title={locale === "en" ? t.switchToArabic : t.switchToEnglish}
        className={clsx("btn-lang-theme", sizeClass)}
      >
        <Globe className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
        {!collapsed && (
          <span className="animate-fade-in">
            {locale === "en" ? t.english : t.arabic}
          </span>
        )}
      </GButton>

      <GButton
        variant="secondary"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? t.switchToLight : t.switchToDark}
        className={clsx("btn-lang-theme", sizeClass)}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-neon-cyan animate-fade-in" />
        ) : (
          <Sun className="w-4 h-4 text-primary animate-fade-in" />
        )}

        {!collapsed && (
          <span className="animate-fade-in">
            {isDark ? t.light : t.dark}
          </span>
        )}
      </GButton>
    </div>
  );
}

export { LangTheme };
