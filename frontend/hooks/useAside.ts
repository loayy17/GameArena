"use client";

import { useState } from "react";

export interface UseAsideReturn {
  collapsed: boolean;
  open: boolean;
  expand: () => void;
  collapse: () => void;
  toggleCollapsed: () => void;
  openMobile: () => void;
  closeMobile: () => void;
  toggleMobile: () => void;
}

function readStoredCollapsed(storageKey: string | undefined, fallback: boolean): boolean {
  if (!storageKey || typeof window === "undefined") return fallback;
  const stored = localStorage.getItem(storageKey);
  return stored != null ? stored === "true" : fallback;
}

export function useAside(defaultCollapsed = true, storageKey?: string): UseAsideReturn {
  const [collapsed, setCollapsed] = useState(() => readStoredCollapsed(storageKey, defaultCollapsed));
  const [open, setOpen] = useState(false);

  const persistCollapsed = (value: boolean) => {
    setCollapsed(value);
    if (storageKey) localStorage.setItem(storageKey, String(value));
  };

  const expand = () => persistCollapsed(false);
  const collapse = () => persistCollapsed(true);
  const toggleCollapsed = () => persistCollapsed(!collapsed);

  const openMobile = () => setOpen(true);
  const closeMobile = () => setOpen(false);
  const toggleMobile = () => setOpen((o) => !o);

  return { collapsed, open, expand, collapse, toggleCollapsed, openMobile, closeMobile, toggleMobile };
}
