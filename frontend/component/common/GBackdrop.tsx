"use client";

import { cn } from "@/lib/cn";
import type { IGBackdropProps } from "./def/GBackdrop";

function GBackdrop({ onClick, className }: IGBackdropProps) {
  return <div className={cn("fixed inset-0 z-backdrop bg-overlay backdrop-blur-sm", className)} onClick={onClick} aria-hidden />;
}

export { GBackdrop };
