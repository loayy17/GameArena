import type { ReactNode } from "react";

interface GTabItem<T extends string | number = string> {
  id: T;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface GTabsProps<T extends string | number> {
  tabs: GTabItem<T>[];
  value: T;
  onChange: (tabId: T) => void;
  direction?: "H" | "V";
  variant?: "default" | "pills" | "sidebar" | "underline";
  className?: string;
  tabClassName?: string;
  fullWidth?: boolean;
  renderLabel?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  renderIcon?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  renderBadge?: (tab: GTabItem<T>, active: boolean) => ReactNode;
  children?: ReactNode;
}

export type { GTabItem, GTabsProps };
