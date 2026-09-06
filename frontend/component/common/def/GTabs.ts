import type { ReactNode } from "react";
import type { AccentColorEnum } from "@/domain/enum/AccentColorEnum";

interface IGTabItem<T extends string | number = string> {
  id: T;
  label?: ReactNode;
  icon?: ReactNode;
  badge?: number;
  badgeTone?: AccentColorEnum;
  disabled?: boolean;
}

interface IGTabsProps<T extends string | number> {
  tabs: IGTabItem<T>[];
  value: T;
  onChange: (tabId: T) => void;
  responsive?: boolean;
  className?: string;
  tabClassName?: string;
  /** Id of an externally-rendered tabpanel the tabs control (used when children are not passed). */
  panelId?: string;
  children?: ReactNode;
}

export type { IGTabItem, IGTabsProps };
