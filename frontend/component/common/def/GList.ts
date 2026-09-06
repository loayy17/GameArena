import type { ReactNode } from "react";

export interface IGListProps<T> {
  items: T[];
  children: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  emptyIcon?: ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  className?: string;
  listClassName?: string;
  pageSize?: number;
  defaultPage?: number;
}

