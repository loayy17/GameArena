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

export function useAside(defaultCollapsed = true): UseAsideReturn {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [open, setOpen] = useState(false);

  const expand = () => setCollapsed(false);
  const collapse = () => setCollapsed(true);
  const toggleCollapsed = () => setCollapsed((c) => !c);

  const openMobile = () => setOpen(true);
  const closeMobile = () => setOpen(false);
  const toggleMobile = () => setOpen((o) => !o);

  return { collapsed, open, expand, collapse, toggleCollapsed, openMobile, closeMobile, toggleMobile };
}
