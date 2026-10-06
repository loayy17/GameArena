"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity,
    Bug,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    FileText,
    Globe,
    LogOut,
    Palette,
    Settings,
    User,
} from "lucide-react";
import { Scale } from "lucide-react";

import { useAuth } from "@/app/providers/AuthProvider";
import { useLogout } from "@/hooks/useLogout";
import { useLocale, useTheme, useTranslation } from "@/hooks/useSetting";
import { cn } from "@/lib/cn";
import { sectionLabel } from "@/domain/constant/styleTokens";
import { BUG_REPORT_MAILTO } from "@/domain/constant/app";

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
import { GUserRow } from "@/component/common/GUserRow";
import { GSliderMenu, GSliderMenuHeader } from "@/component/common/GSliderMenu";

import { ar as menuAr } from "@/component/i18n/UserMenu/ar.i18n";
import { en as menuEn } from "@/component/i18n/UserMenu/en.i18n";
import { fr as menuFr } from "@/component/i18n/UserMenu/fr.i18n";

import type { TUserMenuTranslation } from "@/component/i18n/UserMenu/en.i18n";
import type { IGSliderPanel } from "@/component/common/GSliderMenu";

export function UserMenu({ className }: { className?: string }) {
    const { user } = useAuth();
    const router = useRouter();
    const logout = useLogout();
    const [locale, setLocale] = useLocale();
    const [theme, setTheme] = useTheme();
    const t = useTranslation<TUserMenuTranslation>({
        en: menuEn,
        ar: menuAr,
        fr: menuFr,
    });
    const [open, setOpen] = useState(false);

    const close = () => setOpen(false);
    const goTo = (path: string) => {
        close();
        router.push(path);
    };

    const bugReportHref = BUG_REPORT_MAILTO;

    const panels: IGSliderPanel[] = [
        {
            id: "root",
            label: t.userMenu,
            content: ({ navigate }) => (
                <div className="flex flex-col">
                    <div className="border-b border-border p-2">
                        {user && (
                            <GUserRow
                                user={user}
                                size={SizeEnum.sm}
                                onClick={() =>
                                    user?.id && goTo(`/profile/${user.id}`)
                                }
                            />
                        )}
                    </div>
                    <div className="py-1.5">
                        <p className={cn("px-4 pb-1 pt-1", sectionLabel)}>
                            {t.account}
                        </p>
                        <GMenuItem
                            icon={User}
                            label={t.profile}
                            disabled={!user?.id}
                            onClick={() =>
                                user?.id && goTo(`/profile/${user.id}`)
                            }
                        />
                        <GMenuItem
                            icon={Settings}
                            label={t.settings}
                            onClick={() => goTo("/settings")}
                        />
                    </div>
                    <div className="border-t border-border/60 py-1.5">
                        <p className={cn("px-4 pb-1 pt-1", sectionLabel)}>
                            {t.preferences}
                        </p>
                        <GMenuItem
                            icon={Palette}
                            label={t.theme}
                            onClick={() => navigate("theme")}
                        >
                            <GIcon
                                icon={ChevronRight}
                                size={SizeEnum.sm}
                                flip
                            />
                        </GMenuItem>
                        <GMenuItem
                            icon={Globe}
                            label={t.language}
                            onClick={() => navigate("language")}
                        >
                            <GIcon
                                icon={ChevronRight}
                                size={SizeEnum.sm}
                                flip
                            />
                        </GMenuItem>
                    </div>
                    <div className="border-t border-border/60 py-1.5">
                        <GMenuItem
                            icon={CircleHelp}
                            label={t.help}
                            onClick={() => navigate("help")}
                        >
                            <GIcon
                                icon={ChevronRight}
                                size={SizeEnum.sm}
                                flip
                            />
                        </GMenuItem>
                    </div>
                    <div className="border-t border-border/60 py-1">
                        <GMenuItem
                            icon={LogOut}
                            label={t.logout}
                            className="text-danger"
                            onClick={() => {
                                close();
                                void logout();
                            }}
                        />
                    </div>
                </div>
            ),
        },
        {
            id: "theme",
            label: t.theme,
            content: ({ back, backLabel }) => (
                <div className="p-2">
                    <GSliderMenuHeader
                        title={t.theme}
                        onBack={back}
                        backLabel={backLabel}
                    />
                    <GThemePickerItems
                        theme={theme}
                        labels={{
                            [ThemeEnum.Light]: t.light,
                            [ThemeEnum.Dark]: t.dark,
                            [ThemeEnum.System]: t.system,
                        }}
                        onSelect={setTheme}
                    />
                </div>
            ),
        },
        {
            id: "language",
            label: t.language,
            content: ({ back, backLabel }) => (
                <div className="p-2">
                    <GSliderMenuHeader
                        title={t.language}
                        onBack={back}
                        backLabel={backLabel}
                    />
                    <GLocalePickerItems
                        locale={locale}
                        labels={{
                            [LocaleEnum.En]: t.english,
                            [LocaleEnum.Ar]: t.arabic,
                            [LocaleEnum.Fr]: t.french,
                        }}
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
                    <GSliderMenuHeader
                        title={t.help}
                        onBack={back}
                        backLabel={backLabel}
                    />
                    {bugReportHref !== null && (
                        <GMenuItem
                            icon={Bug}
                            label={t.reportBug}
                            onClick={() => {
                                close();
                                window.location.href = bugReportHref;
                            }}
                        />
                    )}
                    <GMenuItem
                        icon={Activity}
                        label={t.healthServices}
                        onClick={() => goTo("/health")}
                    />
                    <GMenuItem
                        icon={FileText}
                        label={t.privacyPolicy}
                        onClick={() => goTo("/privacy")}
                    />
                    <GMenuItem
                        icon={Scale}
                        label={t.termsOfService}
                        onClick={() => goTo("/terms")}
                    />
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
                <GButton
                    variant={ButtonVariantEnum.Subtle}
                    aria-label={t.userMenu}
                    className="rounded-full"
                    onClick={() => setOpen((current) => !current)}
                >
                    <GAvatar user={user} size={SizeEnum.xs} />
                    <span className="hidden max-w-32 truncate text-sm font-medium text-text sm:inline-block">
                        {user?.fullName?.trim() || user?.userName || ""}
                    </span>
                    <GIcon
                        icon={ChevronDown}
                        size={SizeEnum.xs}
                        className="shrink-0 text-text-muted"
                    />
                </GButton>
            }
        >
            <GSliderMenu panels={panels} backLabel={t.back} />
        </GDropdown>
    );
}

