import { useLocale, useTheme } from "@/Hooks/useTranslation";
import { Globe, Sun, Moon } from "lucide-react";
import { TButton } from "./TButton";
import clsx from "clsx";

function LangTheme({
  collapsed,
  className = "",
}: {
  collapsed: boolean;
  className?: string;
}) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();

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
      {/* Locale Toggle Button */}
      <TButton
        onClick={() => setLocale(locale === "en" ? "ar" : "en")}
        title={locale === "en" ? "Switch to Arabic" : "التغيير إلى الإنجليزية"}
        className={clsx("btn-lang-theme", sizeClass)}
      >
        <Globe className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
        {!collapsed && (
          <span className="animate-fade-in">
            {locale === "en" ? "English" : "العربية"}
          </span>
        )}
      </TButton>

      {/* Theme Toggle TButton */}
      <TButton
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={clsx("btn-lang-theme", sizeClass)}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-neon-cyan animate-fade-in" />
        ) : (
          <Sun className="w-4 h-4 text-primary animate-fade-in" />
        )}

        {!collapsed && (
          <span className="animate-fade-in">{isDark ? "Light" : "Dark"}</span>
        )}
      </TButton>
    </div>
  );
}

export { LangTheme };
