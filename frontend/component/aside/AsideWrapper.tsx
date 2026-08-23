"use client";

import { cn } from "@/lib/cn";
import type { IAsideWrapperProps } from "./def/AsideWrapper";

function AsideWrapper({ config, collapsed, header, children, footer, className }: IAsideWrapperProps) {
  const { expandedWidth, collapsedWidth, label } = config;

  const width = collapsed ? collapsedWidth : expandedWidth;

  return (
    <aside aria-label={label} className={cn("bg-bg-sidebar flex h-full shrink-0 flex-col border-e border-border/60", width, className)}>
      {header}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">{children}</div>
      {footer && <footer className="shrink-0 border-t border-border/60">{footer}</footer>}
    </aside>
  );
}

export { AsideWrapper };
