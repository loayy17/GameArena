"use client";

import { useMemo, useSyncExternalStore } from "react";

import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";
import {
    COOKIE_MAX_AGE,
    SETTING_COOKIE,
    SETTING_STORAGE_KEY,
} from "@/domain/constant/settings";
import { localeDirection } from "@/lib/locale";

import type { TDirection } from "@/lib/locale";
import type { THashMap, TTranslate } from "@/domain/type/TCommon";

let currentLocale: LocaleEnum = LocaleEnum.En;
let currentTheme: ThemeEnum = ThemeEnum.Dark;

const listeners = new Set<() => void>();

function emit() {
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function updateLocaleDOM(locale: LocaleEnum) {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = localeDirection(locale);
}

function updateThemeDOM(theme: ThemeEnum) {
    if (typeof document === "undefined") return;
    document.documentElement.dataset.theme = theme;
}

function readCookieValue(name: string): string | null {
    if (typeof document === "undefined") return null;
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
}

function readStorage(name: string): string | null {
    if (typeof window === "undefined") return null;
    try {
        return localStorage.getItem(name);
    } catch {
        return null;
    }
}

function writeStorage(name: string, value: string) {
    try {
        localStorage.setItem(name, value);
    } catch {
        // Storage can be unavailable in private browsing; the cookie still carries the setting.
    }
}

function isLocale(value: string | null | undefined): value is LocaleEnum {
    return (
        value === LocaleEnum.En ||
        value === LocaleEnum.Ar ||
        value === LocaleEnum.Fr
    );
}

function isTheme(value: string | null | undefined): value is ThemeEnum {
    return (
        value === ThemeEnum.Light ||
        value === ThemeEnum.Dark ||
        value === ThemeEnum.System
    );
}

export function seedSettings(locale: LocaleEnum, theme: ThemeEnum) {
    if (typeof window !== "undefined") return;

    currentLocale = locale;
    currentTheme = theme;
}

if (typeof window !== "undefined") {
    const cookieLocale = readCookieValue(SETTING_COOKIE.locale);
    const cookieTheme = readCookieValue(SETTING_COOKIE.theme);
    const storedLocale = readStorage(SETTING_STORAGE_KEY.locale);
    const storedTheme = readStorage(SETTING_STORAGE_KEY.theme);

    currentLocale = isLocale(cookieLocale)
        ? cookieLocale
        : isLocale(storedLocale)
          ? storedLocale
          : LocaleEnum.En;
    currentTheme = isTheme(cookieTheme)
        ? cookieTheme
        : isTheme(storedTheme)
          ? storedTheme
          : ThemeEnum.Dark;

    updateLocaleDOM(currentLocale);
    updateThemeDOM(currentTheme);
}

function getLocale(): LocaleEnum {
    return currentLocale;
}

function setLocale(locale: LocaleEnum) {
    if (locale === currentLocale) return;
    currentLocale = locale;
    writeStorage(SETTING_STORAGE_KEY.locale, locale);
    document.cookie = `${SETTING_COOKIE.locale}=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    updateLocaleDOM(locale);
    emit();
}

function getTheme(): ThemeEnum {
    return currentTheme;
}

function setTheme(theme: ThemeEnum) {
    if (theme === currentTheme) return;
    currentTheme = theme;
    writeStorage(SETTING_STORAGE_KEY.theme, theme);
    document.cookie = `${SETTING_COOKIE.theme}=${theme}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    updateThemeDOM(theme);
    emit();
}

export function useLocale() {
    const locale = useSyncExternalStore(subscribe, getLocale, getLocale);
    return [locale, setLocale] as const;
}

export function useTheme() {
    const theme = useSyncExternalStore(subscribe, getTheme, getTheme);
    return [theme, setTheme] as const;
}

export function useDirection(): TDirection {
    const [locale] = useLocale();
    return localeDirection(locale);
}

function resolve(obj: THashMap, path: string[]): unknown {
    return path.reduce((acc: unknown, key) => {
        if (typeof acc !== "object" || acc === null) return undefined;
        return (acc as THashMap)[key];
    }, obj);
}
function createProxy(
    langs: TTranslate,
    locale: LocaleEnum,
    path: string[] = [],
): unknown {
    return new Proxy(
        {},
        {
            get(_, key) {
                if (typeof key !== "string") return undefined;

                if (
                    [
                        "$$typeof",
                        "prototype",
                        "constructor",
                        "toJSON",
                        "toString",
                        "valueOf",
                    ].includes(key)
                ) {
                    return undefined;
                }

                const segments = key.split(".");
                const nextPath = [...path, ...segments];
                const value = resolve(langs[locale] ?? langs.en, nextPath);

                if (
                    value &&
                    typeof value === "object" &&
                    !Array.isArray(value)
                ) {
                    return createProxy(langs, locale, nextPath);
                }

                if (value !== undefined) return value;

                return nextPath.join(".");
            },
            has(_, key) {
                if (typeof key !== "string") return false;
                return (
                    resolve(langs[locale] ?? langs.en, [
                        ...path,
                        ...key.split("."),
                    ]) !== undefined
                );
            },
        },
    );
}

export function useTranslation<T>(langs: TTranslate): T {
    const [locale] = useLocale();

    return useMemo(
        () =>
            createProxy(
                { en: langs.en, ar: langs.ar, fr: langs.fr },
                locale,
            ) as T,
        [locale, langs.en, langs.ar, langs.fr],
    );
}
