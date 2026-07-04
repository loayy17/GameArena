"use client";

import { useMemo, useSyncExternalStore } from "react";
import type {
  THashMap,
  TLocale,
  TTheme,
  TTranslate,
} from "@/domain/type/TCommon";

let currentLocale: TLocale = "ar";
let currentTheme: TTheme = "dark";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function updateLocaleDOM(locale: TLocale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
}

function updateThemeDOM(theme: TTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
}

(() => {
  if (typeof window === "undefined") return;
  currentLocale = (localStorage.getItem("locale") as TLocale) ?? "ar";
  currentTheme = (localStorage.getItem("theme") as TTheme) ?? "dark";
  updateLocaleDOM(currentLocale);
  updateThemeDOM(currentTheme);
})();

export function getLocale(): TLocale {
  return currentLocale;
}

export function setLocale(locale: TLocale) {
  if (locale === currentLocale) return;
  currentLocale = locale;
  localStorage.setItem("locale", locale);
  document.cookie = `locale=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  updateLocaleDOM(locale);
  emit();
}

export function getTheme(): TTheme {
  return currentTheme;
}

export function setTheme(theme: TTheme) {
  if (theme === currentTheme) return;
  currentTheme = theme;
  localStorage.setItem("theme", theme);
  document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
  updateThemeDOM(theme);
  emit();
}

export function useLocale() {
  const locale = useSyncExternalStore(subscribe, getLocale, () => "en");
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

function createProxy(langs: TTranslate, path: string[] = []): unknown {
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

        const locale = langs[getLocale()] ?? langs.en;
        const nextPath = [...path, key];
        const value = resolve(locale as THashMap, nextPath);

        if (value && typeof value === "object" && !Array.isArray(value)) {
          return createProxy(langs, nextPath);
        }

        if (value !== undefined) return value;

        if (process.env.NODE_ENV === "development") {
          console.warn(`[i18n] missing key "${nextPath.join(".")}"`);
        }

        return nextPath.join(".");
      },
    },
  );
}

export function useTranslation<T>(langs: TTranslate): T {
  const [locale] = useLocale();

  return useMemo(() => createProxy(langs) as T, [locale]);
}
