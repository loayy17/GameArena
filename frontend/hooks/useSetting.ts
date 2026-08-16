"use client";

import { useMemo, useSyncExternalStore } from "react";
import type { THashMap, TTranslate } from "@/domain/type/TCommon";
import { LocaleEnum } from "@/domain/enum/LocaleEnum";
import { ThemeEnum } from "@/domain/enum/ThemeEnum";

let currentLocale: LocaleEnum = LocaleEnum.Ar;
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
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

function updateThemeDOM(theme: ThemeEnum) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

if (typeof window !== "undefined") {
  currentLocale = (localStorage.getItem("locale") as LocaleEnum) ?? "en";
  currentTheme = (localStorage.getItem("theme") as ThemeEnum) ?? "dark";
}

function getLocale(): LocaleEnum {
  return currentLocale;
}

function setLocale(locale: LocaleEnum) {
  if (locale === currentLocale) return;
  currentLocale = locale;
  localStorage.setItem("locale", locale);
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  updateLocaleDOM(locale);
  emit();
}

function getTheme(): ThemeEnum {
  return currentTheme;
}

function setTheme(theme: ThemeEnum) {
  if (theme === currentTheme) return;
  currentTheme = theme;
  localStorage.setItem("theme", theme);
  document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  updateThemeDOM(theme);
  emit();
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getLocale, () => "en" as LocaleEnum);
  return [locale, setLocale] as const;
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark");
  return [theme, setTheme] as const;
}

function resolve(obj: THashMap, path: string[]): unknown {
  return path.reduce((acc: unknown, key) => {
    if (typeof acc !== "object" || acc === null) return undefined;
    return (acc as THashMap)[key];
  }, obj);
}
function createProxy(langs: TTranslate, locale: LocaleEnum, path: string[] = []): unknown {
  return new Proxy(
    {},
    {
      get(_, key) {
        if (typeof key !== "string") return undefined;

        if (["$$typeof", "prototype", "constructor", "toJSON", "toString", "valueOf"].includes(key)) {
          return undefined;
        }

        const segments = key.split(".");
        const nextPath = [...path, ...segments];
        const value = resolve(langs[locale] ?? langs.en, nextPath);

        if (value && typeof value === "object" && !Array.isArray(value)) {
          return createProxy(langs, locale, nextPath);
        }

        if (value !== undefined) return value;

        return nextPath.join(".");
      },
      has(_, key) {
        if (typeof key !== "string") return false;
        return resolve(langs[locale] ?? langs.en, [...path, ...key.split(".")]) !== undefined;
      },
    },
  );
}

export function useTranslation<T>(langs: TTranslate): T {
  const [locale] = useLocale();

  return useMemo(() => createProxy({ en: langs.en, ar: langs.ar, fr: langs.fr }, locale) as T, [locale, langs.en, langs.ar, langs.fr]);
}
