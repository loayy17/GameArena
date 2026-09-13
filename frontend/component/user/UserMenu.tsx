"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  Bug,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  Globe,
  LogOut,
  Palette,
  Scale,
  Settings,
  User,
} from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/useLogout";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { cn } from "@/lib/cn";
import { sectionLabel } from "@/domain/constant/style-tokens";
import { ButtonVariantEnum } from "@/domain/enum/ButtonVariantEnum";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { SizeEnum } from "@/domain/enum/SizeEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";

import { GAvatar } from "@/component/common/GAvatar";
import { GButton } from "@/component/common/GButton";
import { GDropdown } from "@/component/common/GDropdown";
import { GIcon } from "@/component/common/GIcon";
import { GLocalePickerItems } from "@/component/common/GLocalePickerItems";
import { GMenuItem } from "@/component/common/GMenuItem";
import { GThemePickerItems } from "@/component/common/GThemePickerItems";
import { GUserRow } from "./GUserRow";

import { ar as menuAr } from "@/component/i18n/UserMenu/ar.i18n";
import { en as menuEn } from "@/component/i18n/UserMenu/en.i18n";
import { fr as menuFr } from "@/component/i18n/UserMenu/fr.i18n";

import type { TUserMenuTranslation } from "@/component/i18n/UserMenu/en.i18n";

const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL;
const BUG_REPORT_MAILTO = SUPPORT_EMAIL ? `mailto:${SUPPORT_EMAIL}?subject=GameArena%20Bug%20Report` : null;

// ==========================================
// 1. Simplified GSliderMenu (No Context)
// ==========================================

export interface ISliderMenuNavigation {
  navigate: (panelId: string) => void;
  back: () => void;
  canGoBack: boolean;
  backLabel?: string;
}

export interface IGSliderPanel {
  id: string;
  label?: string;
  content: ReactNode | ((nav: ISliderMenuNavigation) => ReactNode);
}

export interface IGSliderMenuProps {
  panels: IGSliderPanel[];
  backLabel?: string;
  className?: string;
}

export function GSliderMenu({ panels, backLabel = "Back", className }: IGSliderMenuProps) {
  const firstPanelId = panels[0]?.id ?? "";

  const [view, setView] = useState({
    id: firstPanelId,
    direction: "forward" as "forward" | "back",
    history: [] as string[],
  });

  const [height, setHeight] = useState<number | undefined>();
  const panelRef = useRef<HTMLDivElement | null>(null);

  const activePanel = panels.find((panel) => panel.id === view.id) ?? panels[0];

  const navigate = useCallback(
    (panelId: string) => {
      if (!panels.some((p) => p.id === panelId)) return;
      setView((current) =>
        current.id === panelId
          ? current
          : {
              id: panelId,
              direction: "forward",
              history: [...current.history, current.id],
            },
      );
    },
    [panels],
  );

  const back = useCallback(() => {
    setView((current) => {
      const previousId = current.history[current.history.length - 1];
      if (!previousId) return current;
      return {
        id: previousId,
        direction: "back",
        history: current.history.slice(0, -1),
      };
    });
  }, []);

  // Fallback reset if active panel ID no longer exists
  useEffect(() => {
    if (!panels.length || panels.some((p) => p.id === view.id)) return;
    setView({ id: panels[0].id, direction: "forward", history: [] });
  }, [panels, view.id]);

  // Smooth Height Synchronization
  useLayoutEffect(() => {
    const element = panelRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize[0]?.blockSize ?? element.offsetHeight);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [view.id]);

  if (!activePanel) {
    return <div className={cn("relative overflow-hidden", className)} />;
  }

  const animationClass = view.direction === "back" ? "animate-slide-in-start" : "animate-slide-in-end";
  const canGoBack = view.history.length > 0;

  const renderedContent =
    typeof activePanel.content === "function" ? activePanel.content({ navigate, back, canGoBack, backLabel }) : activePanel.content;

  return (
    <div
      className={cn("relative overflow-hidden transition-[height] duration-300 ease-out", className)}
      style={{ height: height ? `${height}px` : "auto" }}>
      <div key={activePanel.id} ref={panelRef} className={cn("w-full", animationClass)}>
        {renderedContent}
      </div>
    </div>
  );
}

interface IGSliderMenuHeaderProps {
  title: string;
  onBack?: () => void;
  backLabel?: string;
  className?: string;
}

export function GSliderMenuHeader({ title, onBack, backLabel = "Back", className }: IGSliderMenuHeaderProps) {
  return (
    <div className={cn("flex min-w-0 items-center gap-2 py-1", className)}>
      {onBack && (
        <GButton
          icon={ChevronLeft}
          label={backLabel}
          variant={ButtonVariantEnum.Subtle}
          size={SizeEnum.icon}
          aria-label={backLabel}
          onClick={onBack}
          className="shrink-0"
        />
      )}
      <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-text">{title}</h3>
    </div>
  );
}

export function UserMenu({ className }: { className?: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const logout = useLogout();
  const [locale, setLocale] = useLocale();
  const [theme, setTheme] = useTheme();
  const t = useTranslation<TUserMenuTranslation>({ en: menuEn, ar: menuAr, fr: menuFr });
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);
  const act = (action: () => void) => {
    close();
    action();
  };
  const goTo = (path: string) => act(() => router.push(path));

  const panels: IGSliderPanel[] = [
    {
      id: "root",
      label: t.userMenu,
      content: ({ navigate }) => (
        <div className="flex flex-col">
          <div className="border-b border-border p-2">
            {user && <GUserRow user={user} size={SizeEnum.sm} onClick={() => user?.id && goTo(`/profile/${user.id}`)} />}
          </div>
          <div className="py-1.5">
            <p className={cn("px-4 pb-1 pt-1", sectionLabel)}>{t.account}</p>
            <GMenuItem icon={User} label={t.profile} disabled={!user?.id} onClick={() => user?.id && goTo(`/profile/${user.id}`)} />
            <GMenuItem icon={Settings} label={t.settings} onClick={() => goTo("/settings")} />
          </div>
          <div className="border-t border-border/60 py-1.5">
            <p className={cn("px-4 pb-1 pt-1", sectionLabel)}>{t.preferences}</p>
            <GMenuItem icon={Palette} label={t.theme} onClick={() => navigate("theme")}>
              <GIcon icon={ChevronRight} size={SizeEnum.sm} flip />
            </GMenuItem>
            <GMenuItem icon={Globe} label={t.language} onClick={() => navigate("language")}>
              <GIcon icon={ChevronRight} size={SizeEnum.sm} flip />
            </GMenuItem>
          </div>
          <div className="border-t border-border/60 py-1.5">
            <GMenuItem icon={CircleHelp} label={t.help} onClick={() => navigate("help")}>
              <GIcon icon={ChevronRight} size={SizeEnum.sm} flip />
            </GMenuItem>
          </div>
          <div className="border-t border-border/60 py-1">
            <GMenuItem icon={LogOut} label={t.logout} className="text-danger" onClick={() => act(() => void logout())} />
          </div>
        </div>
      ),
    },
    {
      id: "theme",
      label: t.theme,
      content: ({ back, backLabel }) => (
        <div className="p-2">
          <GSliderMenuHeader title={t.theme} onBack={back} backLabel={backLabel} />
          <GThemePickerItems theme={theme} labels={{ [ThemeEnum.Light]: t.light, [ThemeEnum.Dark]: t.dark }} onSelect={setTheme} />
        </div>
      ),
    },
    {
      id: "language",
      label: t.language,
      content: ({ back, backLabel }) => (
        <div className="p-2">
          <GSliderMenuHeader title={t.language} onBack={back} backLabel={backLabel} />
          <GLocalePickerItems
            locale={locale}
            labels={{ [LocaleEnum.En]: t.english, [LocaleEnum.Ar]: t.arabic, [LocaleEnum.Fr]: t.french }}
            onSelect={setLocale}
          />
        </div>
      ),
    },
    {
      id: "help",
      label: t.help,
      content: ({ back, backLabel }) => (
        <div className="p-2">
          <GSliderMenuHeader title={t.help} onBack={back} backLabel={backLabel} />
          {BUG_REPORT_MAILTO && (
            <GMenuItem
              icon={Bug}
              label={t.reportBug}
              onClick={() =>
                act(() => {
                  window.location.href = BUG_REPORT_MAILTO;
                })
              }
            />
          )}
          <GMenuItem icon={Activity} label={t.healthServices} onClick={() => goTo("/health")} />
          <GMenuItem icon={FileText} label={t.privacyPolicy} onClick={() => goTo("/privacy")} />
          <GMenuItem icon={Scale} label={t.termsOfService} onClick={() => goTo("/terms")} />
        </div>
      ),
    },
  ];

  return (
    <GDropdown
      open={open}
      onClose={close}
      className={cn("w-64", className)}
      trigger={
        <GButton variant={ButtonVariantEnum.Subtle} aria-label={t.userMenu} className="rounded-full" onClick={() => setOpen((current) => !current)}>
          <GAvatar user={user} size={SizeEnum.xs} />
          <span className="hidden max-w-32 truncate text-sm font-medium text-text sm:inline-block">
            {user?.fullName?.trim() || user?.userName || ""}
          </span>
          <GIcon icon={ChevronDown} size={SizeEnum.xs} className="shrink-0 text-text-muted" />
        </GButton>
      }>
      <GSliderMenu panels={panels} backLabel={t.back} />
    </GDropdown>
  );
}
