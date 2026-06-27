import { useLocale, useTheme } from "@/Hooks/useTranslation";
import { Globe, Sun, Moon } from "lucide-react";
import { TButton } from "./TButton";
import clsx from "clsx";

interface LangThemeProps {
  collapsed: boolean;
  className?: string;
}

function LangTheme({ collapsed, className }: LangThemeProps) {
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();

  const isEn = locale === "en";
  const isDark = theme === "dark";

  return (
    <div
      className={clsx(
        "absolute top-3 right-3 flex items-center gap-1.5 bg-surface/80 backdrop-blur-md p-1 rounded-xl border border-muted/40 shadow-sm z-50 transition-all duration-300",
        collapsed ? "w-auto" : "w-auto px-2",
        className,
      )}
    >
      {/* Language Toggle Button */}
      <TButton
        variant="ghost"
        size="sm"
        onClick={() => setLocale(isEn ? "ar" : "en")}
        title={isEn ? "Switch to Arabic" : "تغيير إلى الإنجليزية"}
        className={clsx(
          "h-8 rounded-lg text-muted-foreground hover:text-foreground font-semibold text-xs",
          collapsed ? "w-8 p-0 justify-center" : "px-2 justify-start gap-1.5",
        )}
      >
        <Globe className="w-4 h-4 shrink-0" />
        {!collapsed && (isEn ? "English" : "العربية")}
      </TButton>

      {/* Small Vertical Divider */}
      <div className="h-4 w-[1px] bg-muted/60" />

      {/* Theme Toggle Button */}
      <TButton
        variant="ghost"
        size="sm"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        title={isDark ? "Switch to Light" : "Switch to Dark"}
        className={clsx(
          "h-8 rounded-lg text-muted-foreground hover:text-foreground font-semibold text-xs",
          collapsed ? "w-8 p-0 justify-center" : "px-2 justify-start gap-1.5",
        )}
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-500 shrink-0" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
        )}
        {!collapsed && (isDark ? "Light" : "Dark")}
      </TButton>
    </div>
  );
}

export { LangTheme };
