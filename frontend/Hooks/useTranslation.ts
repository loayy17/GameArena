"use client";

import { useEffect, useMemo, useState } from "react";
import type { TLocale, THashMap, TTranslate } from "@/types";

let currentLocale: TLocale = "en";

const listeners = new Set<() => void>();

export function setLocale(locale: TLocale): void {
  if (currentLocale === locale) return;

  currentLocale = locale;

  listeners.forEach((listener) => {
    listener();
  });
}

export function getLocale(): TLocale {
  return currentLocale;
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function useLocale() {
  const [locale, setLocaleState] = useState<TLocale>(getLocale());

  useEffect(() => {
    return subscribeLocale(() => {
      setLocaleState(getLocale());
    });
  }, []);

  return [locale, setLocale] as const;
}

function resolve(obj: THashMap, path: string[]): any {
  return path.reduce((acc, key) => acc?.[key], obj);
}

function createProxy(langs: TTranslate, path: string[] = []): any {
  return new Proxy(
    {},
    {
      get(_, key: string | symbol) {
        if (typeof key !== "string") return undefined;

        const locale = langs[getLocale()] ?? langs.en;

        const newPath = [...path, key];

        const value = resolve(locale, newPath);

        if (value && typeof value === "object") {
          return createProxy(langs, newPath);
        }

        if (value !== undefined) {
          return value;
        }

        console.warn(`[i18n] missing key "${newPath.join(".")}"`);

        return newPath.join(".");
      },
    },
  );
}

export function useTranslation<T>(langs: TTranslate): T {
  useLocale();

  return useMemo(() => createProxy(langs), [langs]) as T;
}
